const {  FailedResponse } = require("../Client/HttpResponses");

const checkParameters = (body, databaseSuppliers) => {
    const missingField = [];

    if (body.scope == undefined || body.scope == null) {
        missingField.push("O scope não foi enviado como parametro!");
    }

    if(!body.tipo) {
        missingField.push("O tipo de requisicão não foi enviado!");
    }

    if(body.tipo && body.tipo.toLowerCase() != "orquest" && body.tipo.toLowerCase() != "individual" && body.tipo.toLowerCase() != "painelmultas" && body.tipo.toLowerCase() != "fazenda") {
        missingField.push(`Tipo de consulta inválido!`);
    }

    if (body.scope) {
        if (!existsSupplierInDatabase(body.scope, databaseSuppliers)) {
            missingField.push(`O fornecedor ${body.scope} não foi encontrado no banco de dados! `);
        }
    }

    if (body.tipo && body.tipo.toLowerCase() == "orquest") {
        if (body.produtos == null || body.produtos == undefined) {
            missingField.push(`Quando o tipo de consulta for orquest, os produtos devem ser enviados!`);
        }


        if(body.produtos) {
            const missingProductsInDatabase = [];
            Object.entries(body.produtos).forEach(([key, value]) => {
                if (!existsSupplierInDatabase(key, databaseSuppliers)){          
                    missingProductsInDatabase.push(key);
                }
            });
            if(missingProductsInDatabase.length > 0) missingField.push({message: "Erro encontrar produto(s) no banco de dados", missingProducts: missingProductsInDatabase});
        }
    }

    if(!body.parametros) {
        missingField.push("Os parametros não foram enviados");
    }

    if (missingField.length != 0) {
        const response = { "Erros Encontrados": missingField };
        return { foundError: true, data: new FailedResponse(response)}
    } else {
        return { foundError: false, data: null }
    }
}

const existsSupplierInDatabase = (scope, supplierList) => {
    const filteredData = supplierList.filter(item => item.ambito.toLowerCase() === scope.toLowerCase());
    if (filteredData.length > 0) return true;
    else return false;
}

module.exports = { checkParameters };
