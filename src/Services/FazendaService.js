const { Logs, LogsError } = require("../Entities/Logs");
const { buildURL } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { callAPIIndividual } = require("./IndividualService");
const { getFailedResponse } = require("./SupplierService");

let infractions = [];

const callFazenda = async (body, parent, supplierList, requestFlow) => {
    try {
        let fazendaResponse = await processFazenda(body, parent, supplierList, requestFlow);
        return {response: fazendaResponse};
    } catch (e) {
        console.error(e);
    }
}

const processFazenda = async (body, parent, supplierList, requestFlow) => {
    try {
        const parameters = body.parametros;
        
        let uf = parameters.uf || parameters.UF || findPropertyInJSON(parent, "uf");
        uf = uf.toLowerCase();
        parameters.uf = uf;

        const products = supplierList.filter(item => Array.isArray(item.Tipo_de_Consulta) && item.Tipo_de_Consulta.length != 0 && item.Tipo_de_Consulta.includes("Fazenda") && (item.origemUF === uf || item.origemUF === "br"));
        const productRequests = products.map(async item => {
            const requestBody = { scope: item.ambito, parametros: parameters, produtos: parameters.produtos };
            let response = {};

            if(parent.logs.status.toUpperCase() == "SUCESSO") {
                response = await callAPIIndividual(requestBody, parent, products, requestFlow);
            } else {
                const data = getFailedResponse(item);
                const url = buildURL(item, parameters, null);
                const message = `A consulta (${parent.logs.scope} falhou, portanto os demais produtos não podem ser chamados.`;
                const logs = new Logs(url, data, item, 0, message);
                const logsError = new LogsError(item.ambito);
                logsError.addLog(logs);
                response['response'] = data;
                response['logs'] = logs;
                response['logsError'] =  logsError;
            }
;
            return { content: response, supplier: item };
        }); 

        const promiseResults = await Promise.allSettled(productRequests);

        const resultObject = {};

        // Iterar sobre os resultados das promessas
        promiseResults.forEach((result, index) => {
            let productScope = result.value.content.logs.scope;
            // Condição para modificar o escopo do produto, se necessário
            productScope = productScope.toLowerCase() === "detran" ? productScope + parameters.uf : productScope;
            const productData = { response: result.value.content.response, logs: result.value.content.logs, logsError: result.value.content.logsError };
            resultObject[productScope.toLocaleLowerCase()] = productData;
        });

        return resultObject;
    } catch (e) {
        console.error(e);
    }
}


module.exports = { callFazenda, processFazenda };