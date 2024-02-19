const { Logs, LogsError } = require("../Entities/Logs");
const { buildURL } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { getErrorMessageResponse } = require("../Utils/PrimitiveUtils");
const { callAPIWithTimeout } = require("./APIService");
const { filterSupplierListByScopeAndRequestFlow, mappingSupplierResponse, getFailedResponse } = require("./SupplierService");

const callAPIIndividual = async (body, parent, supplierList, requestFlow) => {
    try {
        let scope = body.ambito;
        if (scope.toLowerCase() == "detran") {
            const uf = body.uf || findPropertyInJSON(parent, 'uf');
            scope = scope + uf;
        }
        scope = body.ambito.toLowerCase() == "detran" ? body.ambito + body.parametros.uf : scope;
        scope = scope.toLowerCase();

        const filteredList = filterSupplierListByScopeAndRequestFlow(scope, body.parametros, body.produtos, requestFlow, supplierList);
        return await processSupplier(filteredList, scope, body.parametros, parent);
    } catch (e) {
        console.error(e);
    }
}

const processSupplier = async (supplierList, scope, parameter, parent) => {
    let requestSuccess = false;
    let response
    let logsError = new LogsError(scope);
    let logs;
    let currentDate;
    try {
        for (let supplier of supplierList) {
            if (requestSuccess) continue;
            url = buildURL(supplier, parameter, parent);
            currentDate = Date.now();
            response = await callAPIWithTimeout(url, supplier, supplier.timeoutMilliseconds || 25000);
            logs = new Logs(url, response, supplier, currentDate, null)
            if (logs.status.toUpperCase() == "SUCESSO") {
                requestSuccess = true;
                logs.setMessage("Requisicao realizada com sucesso!");
            } else {
                logs = new Logs(url, response, supplier, currentDate, getErrorMessageResponse(response));
                logsError.addLog(logs);
            }
            response = mappingSupplierResponse(supplier, response, logs);
        }
        return { data: response, logs, logsError };
    } catch (e) {
        const failedResponse = getFailedResponse(e.data);

        url = buildURL(e.data, parameter, parent);
        logs = new Logs(url, response, e.data, currentDate, e.error);
        logs.setStatus("FALHA");
        logsError.addLog(logs);

        currentDate = Date.now();
        return { data: failedResponse, logs, logsError };
    }
}

module.exports = { callAPIIndividual };