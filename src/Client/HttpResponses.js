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
    constructor(response, logs, fazendaResponse, parentLogsError) {

        const buildedLists = this.buildList(fazendaResponse);
        this.response = response;
        this.logs = logs;
        this.ipva = buildedLists.ipvaList || [];
        this.dpvat = buildedLists.dpvatList || [];
        this.licenciamentos= buildedLists.licenciamentoList || [];
        this.divida_ativa = buildedLists.dividaList || [];
        this.logsError = [];

        this.bindLogsError(fazendaResponse, parentLogsError);

    }
    isNotFalseProperty = (obj) =>  {
        for (let prop in obj) {
            if (obj[prop] !== "Não informado") {
                return false; 
            }
        }
        return true; 
    }

    buildList = (response) => {
        const ipvaList = [];
        const dpvatList = [];
        const licenciamentoList = [];
        const dividaList = [];
    
        for (const key in response) {
            const ipvaArray = response[key].response.ipva;
            const dpvatArray = response[key].response.dpvat;
            const licenciamentos = response[key].response.licenciamentos;
            const divida_ativa = response[key].response.divida_ativa;
    
            if (ipvaArray && Array.isArray(ipvaArray) && ipvaArray.length == 1 && this.isNotFalseProperty(ipvaArray[0])) {
                ipvaList.push(...ipvaArray);
            }
    
            if (dpvatArray && Array.isArray(dpvatArray)) {
                dpvatList.push(...dpvatArray);
            }
    
            if (licenciamentos && Array.isArray(licenciamentos) && licenciamentos.length == 1 && this.isNotFalseProperty(licenciamentos[0])) {
                licenciamentoList.push(...licenciamentos);
            }
    
            if (divida_ativa && Array.isArray(divida_ativa) && divida_ativa.length == 1 && this.isNotFalseProperty(divida_ativa[0])) {
                dividaList.push(...divida_ativa);
            }
        }
    
        return {ipvaList, dpvatList, licenciamentoList, dividaList};
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