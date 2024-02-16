
class IndividualResponse {
    constructor(status, response, logs, logsError) {
        this.status = status;
        this.response = response;
        this.logs = logs;
        this.logsError = logsError;
    }
}

class OrquestResponse {
    constructor(status, response, logs, products ,logsError) {
        this.status = status;
        this.response = response;
        this.logs = logs;
        this.products = products;
        this.logsError = logsError;
    }
}

module.exports = { IndividualResponse, OrquestResponse };