module.exports = class RPCResponse {
  constructor(status, call, response) {
    // enforce required on call and response
    if (call) {
      this.call = call;
    } else {
      throw new Error("call param is missing");
    }

    // validate status
    if (status) {
      if (status === 'success' || status === 'failed') {
        this.status = status;
      } else {
        throw new Error("expects either success or failed");
      }
    } else {
      throw new Error("status param is missing");
    }

    // set response 
    this.response = response ? response : null;
  }

  value() {
    return {
      status: this.status,
      call: this.call,
      response: this.response
    };
  }
};
