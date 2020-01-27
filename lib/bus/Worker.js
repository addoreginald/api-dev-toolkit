const RPCResponse = require("../structs/RPCResponse");

module.exports = class Worker {
  constructor(MessageBus) {
    // Force bus requirement
    if (MessageBus) {
      this.MessageBus = MessageBus;
    } else {
      throw new Error("MessageBus param is missing");
    }

    // Create dispatcher
    const EventEmitter = require("events");
    this.dispatcher = new EventEmitter();
  }

  exec(job) {
    // check if worker exists
    if (this.dispatcher.eventNames().includes(job.functionName)) {
      // Call worker to exec a request
      this.dispatcher.emit(job.functionName, job);
    } else {
      // worker not found !!!
      this.workerNotFoundexception(job.caller);
    }
  }

  workerNotFoundexception(call) {
    // create rsponse
    const response = new RPCResponse("failed", call, "Function not found");

    // Publish response to message bus
    this.MessageBus.publish(call, response);
  }

  createWorker(workerName, callback) {
    // Create listener for worker
    this.dispatcher.on(workerName, job => {
      // Calback to exec when worker bas been called
      callback(this, job);
    });
  }

  done(call, error, data) {
    let response;

    if (error === null) {
      // craft response
      response = new RPCResponse("success", call, data);
    } else {
      response = new RPCResponse("failed", call, error);
    }

    // Publish response to message bus
    this.MessageBus.publish(call, response);
  }
};
