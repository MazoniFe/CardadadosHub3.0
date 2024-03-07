class CustomResponse {
    constructor(response, logs, products, parentLogsError, requestFlow) {
        this.products = products || {};
        this.logsError = [];

        this.addProduct(logs.scope, response, logs, parentLogsError);
        if(requestFlow && requestFlow.toLowerCase() == "orquest"){
            this.bindLogsError(products, parentLogsError);
            this.products = this.removeLogsErrorFromProducts(products);
        } 
    }

    bindLogsError(products, parentLogsError) {
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const item = products[key];
                if(item.logsError && item.logsError.results && item.logsError.results.length > 0) {
                    this.logsError.push(item.logsError);
                }
            }
        }
    }
    

    addProduct(scope, response, logs,  logsError) {
        const product = {response, logs};
        this.products[scope] = product;

        if(logsError && logsError.results) {
            if(logsError.results.length > 0) {
                this.logsError.push(logsError);
            }
        }

    }
    
    removeLogsErrorFromProducts(products) {
        const result = {};
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const { logsError, ...rest } = products[key];
                result[key] = rest; // Adiciona o objeto sem a propriedade logsError ao resultado
            }
        }
        return result;
    }
}

class FinesPanelResponse {
    constructor(response, logs, finesPanel, parentLogsError, correctedInfractions) {
        this.response = response;
        this.logs = logs;
        this.painelMultas = finesPanel;
        this.infracoesCorrigidas = correctedInfractions;
        this.logsError = [];

        this.bindLogsError(finesPanel, parentLogsError);
        this.painelMultas = this.removeLogsErrorFromProducts(finesPanel);

    }

    bindLogsError(products, parentLogsError) {
        if (parentLogsError && parentLogsError.results && parentLogsError.results.length > 0) {
            this.logsError.push(parentLogsError);
        }
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const item = products[key];
                if (item.logsError && item.logsError.results && item.logsError.results.length > 0) {
                    this.logsError.push(item.logsError);
                }
            }
        }
    }    

    removeLogsErrorFromProducts(products) {
        const result = {};
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const { logsError, ...rest } = products[key];
                result[key] = rest; // Adiciona o objeto sem a propriedade logsError ao resultado
            }
        }
        return result;
    }
}

class FazendaResponse {
    constructor(response, logs, finesPanel, parentLogsError, correctedInfractions) {
        this.response = response;
        this.logs = logs;
        this.painelMultas = finesPanel;
        this.infracoesCorrigidas = correctedInfractions;
        this.logsError = [];

        this.bindLogsError(finesPanel, parentLogsError);
        this.painelMultas = this.removeLogsErrorFromProducts(finesPanel);

    }

    bindLogsError(products, parentLogsError) {
        if (parentLogsError && parentLogsError.results && parentLogsError.results.length > 0) {
            this.logsError.push(parentLogsError);
        }
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const item = products[key];
                if (item.logsError && item.logsError.results && item.logsError.results.length > 0) {
                    this.logsError.push(item.logsError);
                }
            }
        }
    }    

    removeLogsErrorFromProducts(products) {
        const result = {};
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const { logsError, ...rest } = products[key];
                result[key] = rest; // Adiciona o objeto sem a propriedade logsError ao resultado
            }
        }
        return result;
    }
}

class FailedResponse {
    constructor(message) {
        this.foundError = true;
        this.message = message;
    }
}

module.exports = {CustomResponse, FinesPanelResponse, FailedResponse, FazendaResponse };