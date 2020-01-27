const Redis = require("ioredis");
const EventEmitter = require("events");
const RPCRequest = require("./../structs/RPCRequest");
const colors = require("colors");
const moment = require("moment");

module.exports = class MessageBus {
  constructor(options) {
    this.options = { ...options };
    this.rpcTimeout = 25000;
  }

  getInstance() {
    return new Redis({
      host: this.options.host,
      port: this.options.port,
      password: this.options.password
    });
  }

  timeoutRPC(connection, serviceName, functionName) {
    return setTimeout(() => {
      connection.disconnect();

      console.log(
        `[${serviceName}] ${functionName} `,
        `Timeout`.red,
        `${this.rpcTimeout} ms`
      );
    }, this.rpcTimeout);
  }

  rpc(serviceName, functionName, args) {
    return new Promise((resolve, reject) => {
      try {
        let timeout, execStart, execEnd;

        // create request
        const request = new RPCRequest(functionName, args);

        // Get redis instance for pub/sub
        const pub = this.getInstance();
        const sub = this.getInstance();

        // Subscribe to channel
        sub.subscribe(request.caller);

        // On new messsage emit message outside this function
        sub.on("message", (channel, message) => {
          if (channel === request.caller) {
            // log exec end time
            execEnd = new moment();

            // parse message
            const parsedMessage = JSON.parse(message);

            resolve(parsedMessage);

            // stop listening for messages
            sub.disconnect();

            // stop timeout
            clearTimeout(timeout);

            const elapsedTime = moment.duration(execEnd.diff(execStart));

            console.log(
              `[${serviceName}] ${functionName} `,
              parsedMessage.status === "success"
                ? `${parsedMessage.status} `.green
                : `${parsedMessage.status} `.red,
              `~${elapsedTime.as("milliseconds")}ms`
            );

            // log error if process fails
            if (parsedMessage.status !== "success") {
              console.error(`[AlphaNet-Error] - `.red, parsedMessage);
            }
          }
        });

        // publish data to service
        pub.publish(serviceName, JSON.stringify({ ...request })).then(() => {
          // set exec start time
          execStart = new moment();

          // disconnect from bus
          pub.disconnect();
        });

        // Start rpc timeout counter
        timeout = this.timeoutRPC(sub, serviceName, functionName);
      } catch (error) {
        // TODO: Replace with custom logger
        reject(error);
      }
    });
  }

  subscribe(channelName) {
    // Create an event emmitter
    const eventEmitter = new EventEmitter();

    try {
      // Get redis instance
      const instance = this.getInstance();

      // Subscribe to channel
      instance.subscribe(channelName);

      // On new messsage emmit message outside this function
      instance.on("message", (channel, message) => {
        if (channel === channelName) {
          eventEmitter.emit("message", JSON.parse(message));
        }
      });
    } catch (error) {
      // TODO: Replace with custom logger
      console.error(error);
    }

    // Return event emitter
    return eventEmitter;
  }

  publish(channel, data) {
    return new Promise((resolve, reject) => {
      try {
        // Get redis instance
        const instance = this.getInstance();

        instance.publish(channel, JSON.stringify(data)).then(() => {
          // disconnect from redis
          instance.disconnect();
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};
