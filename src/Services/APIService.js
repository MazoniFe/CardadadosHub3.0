const {HttpRequest} = require("../Client/HttpRequest");
const { buildHeadersAndData, responseIsValid, buildAPIResponse } = require("../Utils/HttpUtils");
const { extractDataFromXML, isXMLResponse, isXMLData } = require("../Utils/XmlUtils");

const callAPIWithTimeout = (url, supplier, timeoutMilliseconds) => {
    const apiPromise = callAPI(url, supplier);

    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject({error: "Timeout Excedido!", data: supplier});
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
            // Verificando se a resposta da  API é válida
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
        console.error(error);
    }
};


module.exports = {callAPI, callAPIWithTimeout};
