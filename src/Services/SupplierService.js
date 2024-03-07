const { getSupplierUf } = require("../Utils/HttpUtils");
const { findPropertyInJSON, fillEmptyArraysWithObject, editAllJsonProperties, applyTrimToJSONStrings } = require("../Utils/JsonUtils");
const { compareOrder } = require("../Utils/PrimitiveUtils");

const mappingSupplierResponse = (supplier, response, logs) => {
    if (logs.status.toUpperCase() == "SUCESSO") {
        try {

            let targetResponse = supplier.retorno_padrao;
            for (const key in targetResponse) {
                const propertyValue = findPropertyInJSON(targetResponse, key) || key;
                
                const isObject = typeof (propertyValue);
                if (propertyValue != null && isObject == "object") {
                    let newListResponse = [];
                    const standardList = propertyValue.retornoPadrao;
                    const listPropertyValue = findPropertyInJSON(response, propertyValue.campoNome) || null;

                    if (listPropertyValue == null ||listPropertyValue.length === 0) {
                        if(isObjectOrArray(propertyValue) && propertyValue.retornoPadrao){
                            newListResponse.push(getFailedStandardList(propertyValue.retornoPadrao));
                        } else {
                            newListResponse = getFailedStandardList(propertyValue.retornoPadrao);
                        }
                    }

                    if (listPropertyValue && listPropertyValue != null && typeof (listPropertyValue) == Array) {
                        listPropertyValue.forEach(element => {
                            let newList = {};
                            Object.keys(standardList).forEach(key => {
                                const value = standardList[key];
                                const filteredValue = findPropertyInJSON(element, value) || "Não informado!";
                                
                                newList = { ...newList, [key]: filteredValue };
                            });
                            newListResponse.push(newList);
                        });
                    } 
                    else if (listPropertyValue && listPropertyValue != null && typeof (listPropertyValue) == "object") {
                        Object.keys(listPropertyValue).forEach(element => {
                            let newList = {};
                            Object.keys(standardList).forEach(key => {
                                const value = standardList[key];
                                const filteredValue = findPropertyInJSON(listPropertyValue[element], value) || "Não informado!";
                                newList = { ...newList, [key]: filteredValue };
                            });
                            newListResponse.push(newList);
                        });
                    }
                    
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

const isObjectOrArray = (obj) => {
    return typeof(obj) == "object" || typeof(obj) == Array;
}

const getFailedStandardList = (json) => {
    let response = {};
    
    if (typeof (json) == "object") {
        Object.keys(json).forEach(item => {
            response = { ...response, [item]: "Não informado!" };
        })
    } else if (typeof (json) == Array) {
        json.forEach(item => {
            response = { ...response, [item]: "Não informado!" };
        })
    }
    else {
        response = "Não informado!";
    }
    return response;
}

const getFailedResponse = (supplier) => {
    const response = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
    return response;
}



module.exports = { mappingSupplierResponse, filterSupplierListByScopeAndRequestFlow, getFailedResponse };