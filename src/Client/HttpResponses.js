
class IndividualResponse {
    constructor(response, logs, logsError) {
        this.response = response;
        this.logs = logs;
        this.logsError = logsError;
    }
}

class OrquestResponse {
    constructor(response, logs, products, parentLogsError) {
        this.response = response;
        this.logs = logs;
        this.products = products;
        // Inicializa a propriedade logsError como um objeto vazio
        this.logsError = [];

        // Vincula os logs de erro de cada item em products à propriedade logsError
        this.bindLogsError(products, parentLogsError);
        // Remove a propriedade logsError de cada item em products
        this.products = this.removeLogsErrorFromProducts(products);
    }

    bindLogsError(products, parentLogsError) {
        for (const key in products) {
            if (Object.prototype.hasOwnProperty.call(products, key)) {
                const item = products[key];
                if(item.logsError && item.logsError.results.length > 0) {
                    this.logsError.push(item.logsError);
                }

            }
        }
    }

    addProduct(scope, response, logs,  logsError) {
        const product = {response, logs};
        this.products[scope] = product;

        if(logsError.results.length > 0) {
            this.logsError.push(logsError);
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

module.exports = { IndividualResponse, OrquestResponse, FinesPanelResponse };