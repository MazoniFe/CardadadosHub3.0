const {findPropertyInJSON, fillEmptyArraysWithObject, editAllJsonProperties, applyTrimToJSONStrings } = require("../Utils/JsonUtils");
const { compareOrder } = require("../Utils/PrimitiveUtils");

const mappingSupplierResponse = (supplier, response, logs) => {
    if(logs.status.toUpperCase() == "SUCESSO") {
        try {

            let targetResponse = supplier.retorno_padrao;
            for (const key in targetResponse) {
                //AQUI ESTOU BUSCANDO AS PROPRIEDADES QUE FOI PASSADA NO RETORNO PADRAO, DESSA MANEIRA EU SEI QUAL CAMPO EU DEVO PROCURAR NA RESPONSE DA API.
                const propertyValue = findPropertyInJSON(targetResponse, key);
                targetResponse[key] = findPropertyInJSON(response, propertyValue) || "Não informado!";
            }
    
            targetResponse = fillEmptyArraysWithObject(targetResponse);
            targetResponse = applyTrimToJSONStrings(targetResponse);
            return targetResponse;
        } catch(err) {
            console.error(err);
        }
    } else {
        let failedResponse = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
        return failedResponse;
    }
}

const filterSupplierListByScopeAndRequestFlow = (scope, parameter ,products, requestFlow, supplierList) => {

    let filteredList = supplierList;

    if (products && products[scope] && products[scope].length > 0) {
        filteredList = filteredList.filter(item => products[scope].includes(item.id));
    }
    if(requestFlow == "painelmultas"){
        filteredList = filteredList.filter(item => item.Tipo_de_Consulta === 'Painel de Multas' && item.origemUF === parameter.uf && item.ativo === true);
    } else {
        filteredList = scope.toLowerCase() == "detran" 
        ? 
        filteredList.filter(item => item.ambito == scope && item.ativo == true && item.origemUF.toLowerCase() == parameter.uf.toLowerCase())
        : 
        filteredList.filter(item => item.ambito == scope && item.ativo == true);
    }

    filteredList.sort(compareOrder);
    return filteredList;
}

const getFailedResponse = (supplier) => {
    const response = editAllJsonProperties(supplier.retorno_padrao, "Indisponível");
    return response;
}



module.exports = {mappingSupplierResponse, filterSupplierListByScopeAndRequestFlow, getFailedResponse};