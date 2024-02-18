const { callAPIIndividual } = require("./IndividualService");

const callAPIOrquest = async (body, parent ,supplierList, requestFlow) => {
    try{
        return await processProductList(body, parent, supplierList, requestFlow);
    } catch (e) {
        console.error(e);
    }
}


const processProductList = async (body, parent, supplierList, requestFlow) => {
    try {
        const parameters = body.parametros;
        const products = Object.entries(body.produtos).filter(([key, value]) => key !== body.ambito);

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
            resultObject[productScope.toLocaleLowerCase()] = productData;
        });


        return resultObject;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {callAPIOrquest, processProductList};