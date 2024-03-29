const { LogsError, Logs } = require("../Entities/Logs");
const { buildURL, getSupplierUf } = require("../Utils/HttpUtils");
const { callAPIIndividual } = require("./IndividualService");
const { getFailedResponse } = require("./SupplierService");

const callAPIOrquest = async (body, parent ,supplierList, requestFlow) => {
    try{
        return await processProductList(body, parent, supplierList, requestFlow);
    } catch (e) {
        console.error(e);
    }
}


const processProductList = async (body, parent, supplierList, requestFlow) => {
    try {
        let response = {};
        let parameters = body.parametros;
        const products = Object.entries(body.produtos).filter(([key, value]) => key !== body.scope);

        const productRequests = products.map(async ([productScope, productData]) => {
            parameters.uf = getSupplierUf(parameters.uf, parent.response || parent);
            const scope = productScope.toLowerCase();

            const requestBody = { scope: productScope, parametros: parameters, produtos: {[productScope]: productData} };
            if (parent.logs.status.toUpperCase() == "SUCESSO") {
                response = await callAPIIndividual(requestBody, parent, supplierList, requestFlow);
            } else {
                const productListFiltered = supplierList.filter(item => item.ambito == scope && item.ativo == true);
                
                if (productListFiltered.length > 0) {
                    const item = productListFiltered[0];
                    const data = getFailedResponse(item);
                    const url = buildURL(item, parameters, null);
                    const message = `A consulta ${parent.logs.scope} falhou, portanto os demais produtos não podem ser chamados.`;
                
                    // Criar instância de Logs
                    const logs = new Logs(url, data, item, 0, message);
                    
                    // Criar instância de LogsError
                    const logsError = new LogsError(item.ambito);
                    logsError.addLog(logs);
                
                    // Atribuir os objetos às chaves correspondentes em response
                    response['response'] = data;
                    response['logs'] = logs; // Use logs como valor para a chave 'logs'
                    response['logsError'] = logsError; // Use logsError como valor para a chave 'logsError'
                }
            }
            return { [scope]: response }; // Retorna um objeto com o productScope como chave e a resposta como valor
        });

        const results = await Promise.all(productRequests);

        // Combinar todos os resultados em um único objeto
        const resultObject = Object.assign({}, ...results);

        return resultObject;
    } catch (e) {
        console.error(e);
    }
}


module.exports = {callAPIOrquest, processProductList};