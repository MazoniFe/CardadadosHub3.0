const { Logs, LogsError } = require("../Entities/Logs");
const { buildURL } = require("../Utils/HttpUtils");
const { getErrorMessageResponse } = require("../Utils/PrimitiveUtils");
const { callAPIWithTimeout } = require("./APIService");
const { filterSupplierListByScopeAndRequestFlow, mappingSupplierResponse, getFailedResponse } = require("./SupplierService");

const callAPIIndividual = async (body, parent, supplierList, requestFlow) => {
    try {
        let scope = body.scope.toLowerCase();
        const filteredList = filterSupplierListByScopeAndRequestFlow(scope, body.parametros, body.produtos, requestFlow, supplierList, parent);
        return await processSupplier(filteredList, scope, body.parametros, parent);
    } catch (e) {
        console.error(e);
    }
}

const processSupplier = async (supplierList, scope, parameter, parent) => {
    let requestSuccess = false;
    let response;
    let logsError = new LogsError(scope);
    let logs;
    let currentDate;
    for (let supplier of supplierList) {
        try {
            if (requestSuccess) continue;
            const url = buildURL(supplier, parameter, parent);
            currentDate = Date.now();
            response = await callAPIWithTimeout(url, supplier, supplier.timeout || 12000);
            logs = new Logs(url, response, supplier, currentDate, null);

            if (logs.status.toUpperCase() == "SUCESSO") {
                requestSuccess = true;
                logs.setMessage("Requisicao realizada com sucesso!");
            } else {
                logs = new Logs(url, response, supplier, currentDate, getErrorMessageResponse(response));
                logsError.addLog(logs);
            }
            response = mappingSupplierResponse(supplier, response, logs);
        } catch (e) {
            response = getFailedResponse(e.data);
            const url = buildURL(e.data, parameter, parent);
            logs = new Logs(url, response, e.data, currentDate, e.error);
            logs.setStatus("FALHA");
            logsError.addLog(logs);
            continue;
        }
    }

    // Retorna os resultados após iterar sobre todos os fornecedores
    return { response, logs, logsError };
}

module.exports = { callAPIIndividual };