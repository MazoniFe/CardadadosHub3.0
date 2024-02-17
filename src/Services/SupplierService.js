const {findPropertyInJSON, fillEmptyArraysWithObject, editAllJsonProperties, applyTrimToJSONStrings } = require("../Utils/JsonUtils");

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




module.exports = {mappingSupplierResponse};