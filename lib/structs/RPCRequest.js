const uuid = require("uuid/v4");

module.exports = class RPCRequest {
  constructor(functionName, args) {
    // enforce requred on caller and function name

    if (functionName) {
      this.functionName = functionName;
    } else {
      throw new Error("functionName param is missing");
    }

    // Set default for args and caller if it is undefined
    this.args = args ? args : {};
    this.caller = uuid();
  }

  value() {
    return {
      caller: this.caller,
      args: this.args,
      functionName: this.functionName
    };
  }
};
