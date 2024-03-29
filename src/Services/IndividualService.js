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
    let currentSupplier;
    for (let supplier of supplierList) {
        try {
            currentSupplier = supplier;
            if (requestSuccess) continue;
            const url = buildURL(supplier, parameter, parent);
            currentDate = Date.now();
            const apiResponse = await callAPIWithTimeout(url, supplier, supplier.timeout || 12000);
            logs = new Logs(url, apiResponse, supplier, currentDate, null);

            if (logs.status.toUpperCase() == "SUCESSO") {
                requestSuccess = true;
                response = mappingSupplierResponse(supplier, apiResponse, logs);
                logs.setMessage("Requisicao realizada com sucesso!");
            } else {
                response = getFailedResponse(supplier);
                logs = new Logs(url, response, supplier, currentDate, getErrorMessageResponse(apiResponse));
                logsError.addLog(logs);
                continue;
            }
        } catch (e) {
            const failedResponse = getFailedResponse(currentSupplier);
            const url = buildURL(currentSupplier, parameter, parent);
            logs = new Logs(url, failedResponse, supplier, currentDate, getErrorMessageResponse(response));
            logs.setStatus("FALHA");
            logsError.addLog(logs);
            continue;
        }
    }

    // Retorna os resultados após iterar sobre todos os fornecedores
    return { response, logs, logsError };
}

module.exports = { callAPIIndividual };