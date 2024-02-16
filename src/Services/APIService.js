const {compareOrder, getErrorMessageResponse} = require("../Utils/PrimitiveUtils");
const {HttpRequest} = require("../Client/HttpRequest");
const {Logs, LogsError} = require("../Entities/Logs");
const { buildURL, buildHeadersAndData, responseIsValid, buildAPIResponse } = require("../Utils/HttpUtils");
const { response } = require("express");
const { extractDataFromXML, isXMLResponse, isXMLData } = require("../Utils/XmlUtils");
const { mappingSupplierResponse } = require("./SupplierService");

const callAPIWithTimeout = (url, fornecedor, timeoutMilliseconds) => {
    const apiPromise = callAPI(url, fornecedor);

    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(new Error('Timeout da requisição excedido'));
        }, timeoutMilliseconds);
    });

    return Promise.race([apiPromise, timeoutPromise])
        .finally(() => clearTimeout(timeoutPromise));

};

const callAPI = async (urlData, supplier) => {
    // Construindo os cabeçalhos e dados da requisição
    const dataObject = buildHeadersAndData(supplier.Post_Headers, supplier.Post_Body);
    let responseAPI = null;
    let resultData = null;
    const http = new HttpRequest();

    try {
        // Configurando a requisição
        const requestOptions = {
            method: supplier.tipo_requisicao,
            url: urlData,
            headers: supplier.tipo_requisicao === "POST" ? dataObject.headers : null,
            data: supplier.tipo_requisicao === "POST" ? dataObject.data : null,
        };
            const apiResponse = await http.request(requestOptions);
            // Verificando se a resposta da API é válida
            if (responseIsValid(apiResponse, urlData)) {
                responseAPI = { res: apiResponse, api: apiResponse.data };
            }

            // Verificando se a resposta é XML
            if (isXMLResponse(responseAPI.res.headers) && typeof responseAPI.api === "string") {
                const consultaResultXML = responseAPI.api;
                let resultXML = await extractDataFromXML(consultaResultXML);
                resultData = await buildAPIResponse(resultXML, "JSON");
            } else {
                // Criando resposta da API
                resultData = responseAPI.res.data;
            }

            return resultData;
        } 
    
    catch (error) {
        // Lidando com erros
    }
};

const callAPIIndividual = async (body, parent, supplierList, requestFlow) => {
    try{
        const filteredList = filterSupplierListByScoreAndRequestFlow(body.ambito, body.parametros, requestFlow, supplierList);
        return await processSupplier(filteredList, body.ambito ,body.parametros, parent);
    } catch (e) {

    }
}


const processSupplier = async (supplierList, scope, parameter, parent) => {
    try{
        let requestSuccess = false;
        let response
        let logsError = new LogsError(scope);
        let logs;

        for (let supplier of supplierList){
            if(requestSuccess) continue;
            const url = buildURL(supplier, parameter, parent);
            const currentDate = Date.now();
            response = await callAPIWithTimeout(url, supplier, supplier.timeoutMilliseconds || 60000);
            logs = new Logs(url, response, supplier, currentDate, null)
            if(logs.status.toUpperCase() == "SUCESSO"){
                requestSuccess = true;
                logs.setMessage("Requisicao realizada com sucesso!");
            } else {
                logs = new Logs(url, response, supplier, currentDate, getErrorMessageResponse(response));
                logsError.addLog(logs);
            }
            response = mappingSupplierResponse(supplier, response, logs);
        }
        return {data: response, logs, logsError};
    } catch(e) {
        console.log(e);
        return {data: response, logs, logsError};
    }
}


const filterSupplierListByScoreAndRequestFlow = (scope, parameter, requestFlow, supplierList) => {
    if(requestFlow == "painelmultas"){
        let filteredList = upplierList.filter(item => item.Tipo_de_Consulta === 'Painel de Multas' && item.origemUF === parameter.uf && item.ativo === true);
        filteredList.sort(compareOrder);
        return filteredList;
    } else {
        let filteredList = supplierList.filter(item => item.ambito === scope && item.ativo === true);
        filteredList.sort(compareOrder);
        return filteredList;
    }
}


module.exports = {callAPIIndividual};
