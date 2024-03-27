const { getSupplierUf } = require("../Utils/HttpUtils");
const { findPropertyInJSON, fillEmptyArraysWithObject, editAllJsonProperties, applyTrimToJSONStrings } = require("../Utils/JsonUtils");
const { compareOrder } = require("../Utils/PrimitiveUtils");

const mappingSupplierResponse = (supplier, response, logs) => {
    // Verifica se o status nos logs é "SUCESSO"
    if (logs.status.toUpperCase() == "SUCESSO") {
        try {
            // Obtém o padrão de resposta do fornecedor
            let targetResponse = supplier.retorno_padrao;
            
            // Itera sobre as chaves do padrão de resposta
            for (const key in targetResponse) {
                const propertyValue = findPropertyInJSON(targetResponse, key);
                const isObject = typeof (propertyValue);

                // Verifica se o valor é um objeto
                if (isObject == "object" && propertyValue != null && propertyValue != undefined) {
                    targetResponse[key] = mapObjectResponse(propertyValue, response);
                } else {
                    // Se não for um objeto, mapeia o valor simples
                    targetResponse[key] = mapSimpleValue(propertyValue, response);
                }
            }

            // Preenche arrays vazios com um objeto padrão
            targetResponse = fillEmptyArraysWithObject(targetResponse);

            // Aplica trim em todas as strings no objeto
            targetResponse = applyTrimToJSONStrings(targetResponse);

            // Retorna a resposta mapeada
            return targetResponse;
        } catch (err) {
            console.error(err);
        }
    } else {
        // Se o status não for "SUCESSO", retorna uma resposta de falha
        return getFailedResponse(supplier);
    }
}

const filterSupplierListByScopeAndRequestFlow = (scope, parameter, products, requestFlow, supplierList, parent) => {

    let filteredList = supplierList;
    let uf;

    if (parent && parent.response != null && parent.response != undefined) uf = getSupplierUf(parameter.uf, parent['response'])
    else uf = getSupplierUf(parameter.uf, parent);

    if (products && products[scope] && products[scope].length > 0) {
        filteredList = filteredList.filter(item => products[scope].includes(item.id));
    }
    if (requestFlow == "painelmultas") {
        filteredList = filteredList.filter(item => item.Tipo_de_Consulta === 'Painel de Multas' && item.origemUF.toLowerCase() == uf && item.ativo === true);
    } else {
        filteredList = scope.toLowerCase() === "detran"
            ? filteredList.filter(item => item.ambito == scope && item.ativo == true && item.origemUF.toLowerCase() == uf.toLowerCase())
            : filteredList.filter(item => item.ambito == scope && item.ativo == true);
    }

    filteredList.sort(compareOrder);
    return filteredList;
}

const mapSimpleValue = (propertyValue, response) => {

    return findPropertyInJSON(response, propertyValue) || "Não informado";
}

const mapListElement = (standardList, element) => {
    let newList = {};

    Object.keys(standardList).forEach(key => {
        const value = standardList[key];
        const filteredValue = findPropertyInJSON(element, value) || "Não informado";
        newList = { ...newList, [key]: filteredValue };
    });

    return newList;
}

const mapObjectResponse = (propertyValue, response) => {
    let newListResponse = [];
    const standardList = propertyValue.retornoPadrao;
    const listPropertyValue = findPropertyInJSON(response, propertyValue.campoNome) || null;

    // Se o valor da lista não existir na resposta
    if (listPropertyValue == null) {
        newListResponse = {Mensagem: "Não informado"};
    }

    // Se o valor da lista existir na resposta
    if (listPropertyValue) {
        // Verifica o tipo do valor da lista
        if (Array.isArray(listPropertyValue)) {
            if(listPropertyValue.length === 0) {
                newListResponse.push({Mensagem: "Não informado"})
            } else {
                listPropertyValue.forEach(element => {
                    newListResponse.push(mapListElement(standardList, element));
                });
            }

        } else if (typeof (listPropertyValue) == "object") {
            newListResponse.push({Mensagem: "Não informado"});
        }
    }
    
    return newListResponse;
}

const getFailedResponse = (supplier) => {
    const response = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
    return response;
}



module.exports = { mappingSupplierResponse, filterSupplierListByScopeAndRequestFlow, getFailedResponse };