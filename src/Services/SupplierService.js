const { getSupplierUf } = require("../Utils/HttpUtils");
const { findPropertyInJSON, fillEmptyArraysWithObject, editAllJsonProperties, applyTrimToJSONStrings } = require("../Utils/JsonUtils");
const { compareOrder } = require("../Utils/PrimitiveUtils");

const mappingSupplierResponse = (supplier, response, logs) => {
    if (logs.status.toUpperCase() == "SUCESSO") {
        try {

            let targetResponse = supplier.retorno_padrao;
            for (const key in targetResponse) {
                const propertyValue = findPropertyInJSON(targetResponse, key);
                const isObject = typeof (propertyValue);
                if (isObject == "object") {
                    const newListResponse = [];
                    const typeField = propertyValue.tipoCampo.toUpperCase();
                    const standardList = propertyValue.retornoPadrao;
                    const listPropertyValue = findPropertyInJSON(response, propertyValue.campoNome);
                    listPropertyValue.forEach(element => {
                        let newList = {};
                        Object.keys(standardList).forEach(key => {
                            const value = standardList[key];
                            const filteredValue = findPropertyInJSON(element, value);
                            newList = { ...newList, [key]: filteredValue };
                        });
                        newListResponse.push(newList);
                    });
                    targetResponse[key] = newListResponse;
                } else {
                    targetResponse[key] = findPropertyInJSON(response, propertyValue) || "Não informado!";
                }

            }

            targetResponse = fillEmptyArraysWithObject(targetResponse);
            targetResponse = applyTrimToJSONStrings(targetResponse);
            return targetResponse;
        } catch (err) {
            console.error(err);
        }
    } else {
        let failedResponse = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
        return failedResponse;
    }
}

const filterSupplierListByScopeAndRequestFlow = (scope, parameter, products, requestFlow, supplierList, parent) => {

    let filteredList = supplierList;
    const uf = getSupplierUf(parameter.uf, parent);

    if (products && products[scope] && products[scope].length > 0) {
        filteredList = filteredList.filter(item => products[scope].includes(item.id));
    }
    if (requestFlow == "painelmultas") {
        filteredList = filteredList.filter(item => item.Tipo_de_Consulta === 'Painel de Multas' && item.origemUF.toLowerCase() == uf && item.ativo === true);
    } else {
        filteredList = scope.toLowerCase() === "detran"
            ? filteredList.filter(item => item.ambito === scope && item.ativo === true && item.origemUF.toLowerCase() == uf.toLowerCase())
            : filteredList.filter(item => item.ambito === scope && item.ativo === true);
    }

    filteredList.sort(compareOrder);
    return filteredList;
}

const getFailedResponse = (supplier) => {
    const response = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
    return response;
}



module.exports = { mappingSupplierResponse, filterSupplierListByScopeAndRequestFlow, getFailedResponse };