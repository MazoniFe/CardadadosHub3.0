const axios = require('axios');

class HttpRequest {
    constructor() {
    }

    async request(configs) {
        const response = await axios(configs);
        return response;
    }
}

module.exports = {HttpRequest};