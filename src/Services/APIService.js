const {compareOrder, getErrorMessageResponse} = require("../Utils/PrimitiveUtils");
const {HttpRequest} = require("../Client/HttpRequest");
const {Logs, LogsError} = require("../Entities/Logs");
const { buildURL, buildHeadersAndData, responseIsValid, buildAPIResponse } = require("../Utils/HttpUtils");
const { extractDataFromXML, isXMLResponse, isXMLData } = require("../Utils/XmlUtils");
const { mappingSupplierResponse } = require("./SupplierService");
const { editAllJsonProperties, findPropertyInJSON } = require("../Utils/JsonUtils");

const callAPIWithTimeout = (url, fornecedor, timeoutMilliseconds) => {
    const apiPromise = callAPI(url, fornecedor);

    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject({error: "Timeout Excedido!", data: fornecedor});
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
        let scope = body.ambito;
        if(scope.toLowerCase() == "detran") {
            const uf = body.uf || findPropertyInJSON(parent, 'uf');
            scope = scope + uf;
        }

        scope = body.ambito.toLowerCase() == "detran" ? body.ambito + body.parametros.uf : body.ambito;
        const filteredList = filterSupplierListByScopeAndRequestFlow(scope, body.produtos, requestFlow, supplierList);
        return await processSupplier(filteredList, scope ,body.parametros, parent);
    } catch (e) {
        console.error(e);
    }
}

const callAPIOrquest = async (body, parent ,supplierList, requestFlow) => {
    try{
        return await processProductList(body, parent, supplierList, requestFlow);
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
    try{
        for (let supplier of supplierList){
            if(requestSuccess) continue;
            url = buildURL(supplier, parameter, parent);
            currentDate = Date.now();
            response = await callAPIWithTimeout(url, supplier, supplier.timeoutMilliseconds || 25000);
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
        const failedResponse = getFailedResponse(e.data);
        
        url = buildURL(e.data, parameter, parent);
        logs = new Logs(url, response, e.data, currentDate, e.error);
        logs.setStatus("FALHA");
        logsError.addLog(logs);

        currentDate = Date.now();
        return {data: failedResponse, logs, logsError};
    }
}

const processProductList = async (body, parent, supplierList, requestFlow) => {
    try {
        const parameters = body.parametros;
        const products = Object.entries(body.produtos).filter(([key, value]) => key !== body.ambito);

        console.log(products);

        const productRequests = products.map(([productScope, productData]) => {
            const requestBody = { ambito: productScope, parametros: parameters, produtos: productData };
            return callAPIIndividual(requestBody, parent, supplierList, requestFlow);
        });
        

        const promiseResults = await Promise.allSettled(productRequests);

        // Criar um objeto para armazenar os resultados
        const resultObject = {};

        // Iterar sobre os resultados das promessas
        promiseResults.forEach((result, index) => {
            // Obtendo o escopo do produto
            let productScope = products[index][0];

            // Condição para modificar o escopo do produto, se necessário
            productScope = productScope.toLowerCase() === "detran" ? productScope + parameters.uf : productScope;

            const productData = { response: result.value.data, logs: result.value.logs, logsError: result.value.logsError };
            // Adicionar os dados ao objeto de resultados usando o escopo do produto como chave
            resultObject[productScope] = productData;
        });


        return resultObject;
    } catch (e) {
        console.error(e);
    }
}

const getFailedResponse = (fornecedor) => {
    const response = editAllJsonProperties(fornecedor.retorno_padrao, "Indisponível");
    return response;

}

const filterSupplierListByScopeAndRequestFlow = (scope, products, requestFlow, supplierList) => {

    let filteredList = supplierList;

    if(products[scope] > 0) {
       filteredList = filteredList.filter(item => products[scope].includes(item.id));
    }

    if(requestFlow == "painelmultas"){
        filteredList = filteredList.filter(item => item.Tipo_de_Consulta === 'Painel de Multas' && item.origemUF === parameter.uf && item.ativo === true);
    } else {
        filteredList = filteredList.filter(item => item.ambito === scope && item.ativo === true);
    }

    filteredList.sort(compareOrder);
    return filteredList;
}


module.exports = {callAPIIndividual, callAPIOrquest};
