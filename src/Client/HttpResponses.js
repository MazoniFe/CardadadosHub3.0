
class IndividualResponse {
    constructor(status, response, logs, logsError) {
        this.status = status;
        this.response = response;
        this.logs = logs;
        this.logsError = logsError;
    }
}

class OrquestResponse {
    constructor(status, response, logs, products, logsError) {
        this.status = status;
        this.response = response;
        this.logs = logs;
        this.products = products;
        this.logsError = logsError;

        // Inicializa a propriedade logsError como um objeto vazio
        this.logsError = {};

        // Vincula os logs de erro de cada item em products à propriedade logsError
        this.bindLogsError(products);
        // Remove a propriedade logsError de cada item em products
        this.products = this.removeLogsErrorFromProducts(products);
    }

    bindLogsError(products) {
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const item = products[key];
                // Adiciona os logs de erro do item atual ao objeto this.logsError
                this.logsError = { ...this.logsError, ...item.logsError };
            }
        }
    }

    addProduct(scope, response, logs,  logsError) {
        const product = {response, logs};
        this.products[scope] = product;

        if(logsError.results.length > 0) {

            this.logsError = {...this.logsError, logsError};
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

module.exports = { IndividualResponse, OrquestResponse };