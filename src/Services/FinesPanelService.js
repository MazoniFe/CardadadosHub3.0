const { Logs, LogsError } = require("../Entities/Logs");
const { buildURL } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { callAPIIndividual } = require("./IndividualService");
const { getFailedResponse } = require("./SupplierService");

let infractions = [];

const callFinesPanel = async (body, parent, supplierList, requestFlow) => {
    try {
        let finesPanelresponse = await processFinesPanel(body, parent, supplierList, requestFlow);
        return {response: finesPanelresponse, correctedInfractions : infractions};
    } catch (e) {
        console.error(e);
    }
}

const processFinesPanel = async (body, parent, supplierList, requestFlow) => {
    try {
        const parameters = body.parametros;

        let uf = parameters.uf || parameters.UF || findPropertyInJSON(parent, "uf");
        uf = uf.toLowerCase();
        //const products = supplierList.filter(item => item.Tipo_de_Consulta != null && item.Tipo_de_Consulta.contains("Painel de Multas") && item.origemUF == uf && item.ativo == true);
        const products = supplierList.filter(item => Array.isArray(item.Tipo_de_Consulta) && item.Tipo_de_Consulta.length != 0 && item.Tipo_de_Consulta.includes("Painel de Multas") && (item.origemUF == uf || item.origemUF == "br"));
        const productRequests = products.map(async item => {
            const requestBody = { scope: item.ambito, parametros: parameters, produtos: parameters.produtos };
            let response = {};
            
            if(parent.logs.status.toUpperCase() == "SUCESSO") {
                response = await callAPIIndividual(requestBody, parent, supplierList, requestFlow);
            } else {
                const data = getFailedResponse(item);
                const url = buildURL(item, parameters, null);
                const message = `A consulta (${parent.logs.scope} falhou, portanto os demais produtos não podem ser chamados.`;
                const logs = new Logs(url, data, item, 0, message);
                const logsError = new LogsError(item.ambito);
                logsError.addLog(logs);
                response['response'] = data;
                response['logs'] = logs;
                response['logsError'] =  logsError;
            }
;
            return { content: response, supplier: item };
        }); 

        const promiseResults = await Promise.allSettled(productRequests);

        const resultObject = {};

        // Iterar sobre os resultados das promessas
        promiseResults.forEach((result, index) => {
            let productScope = result.value.content.logs.scope;
            // Condição para modificar o escopo do produto, se necessário
            productScope = productScope.toLowerCase() === "detran" ? productScope + parameters.uf : productScope;
            const productData = { response: result.value.content.response, logs: result.value.content.logs, logsError: result.value.content.logsError };
            resultObject[productScope.toLocaleLowerCase()] = productData;
            processInfractionCorrections(result.value.content.response, result.value.supplier);
        });


        return resultObject;
    } catch (e) {
        console.error(e);
    }
}

const processInfractionCorrections = (response, supplier) => {
    const supplierSource = supplier.fonte;
    const infractionsField = findPropertyInJSON(response, supplier.infracoes_campo);
    const infra_standard = supplier.retorno_infra_padrao;

    if (infractionsField != null && infractionsField != undefined) {
        for (const infr of infractionsField) {
            let corrected_infractions = {};
            for (const key of Object.keys(infra_standard)) {
                const propertyValue = findPropertyInJSON(infra_standard, key);
                if (key === "Consultas") {
                    corrected_infractions[key] = findPropertyInJSON(response, propertyValue) || 'Nao informado';
                } else {
                    corrected_infractions[key] = findPropertyInJSON(infr, propertyValue) || 'Nao informado';
                }
            }
            const ait = corrected_infractions.ait;
            const formated_ait = ait.replace(/[\s-]/g, '');
            let short_ait;

            switch (supplierSource) {
                case 'FAZENDA':
                case 'DER':
                    short_ait = formated_ait.substring(1, 8);
                    break;
                case 'AIT':
                case 'PREFEITURA':
                case 'RENAINF':
                    short_ait = formated_ait.substring(2, 9);
                    break;
                default:
                    short_ait = formated_ait.substring(1, 8);
                    break;
            }

            if (/[a-z]/i.test(short_ait)) {
                short_ait = formated_ait.substring(2, 10);
                if (/[a-z]/i.test(short_ait)) {
                    short_ait = formated_ait.slice(-6);
                }
            }

            if (short_ait.length <= 6) {
                if (short_ait.length <= 5) {
                    switch (fornecedor.fonte) {
                        case 'FAZENDA':
                        case 'DER':

                            short_ait = formated_ait.substring(1, 7);
                            break;
                        case 'AIT':
                        case 'PREFEITURA':
                        case 'RENAINF':
                            short_ait = formated_ait.substring(2, 9);
                            break;
                        default:
                            short_ait = formated_ait.substring(1, 7);
                            break;
                    }
                }
                short_ait += '1';
            }

            if (infractions.some(item => item.ait === short_ait)) {
                const existingItem = infractions.find(item => item.ait === short_ait);

                if (formatValue(corrected_infractions.valor) > formatValue(existingItem.valor)) {
                    infractions = infractions.filter(item => item.ait !== short_ait);
                    corrected_infractions['ait'] = short_ait;
                    infractions.push(corrected_infractions);
                }
            } 
            else {
                corrected_infractions['ait'] = short_ait;
                infractions.push(corrected_infractions);
            }
        }
    }
}

const formatValue = (value) => {
    // Remove o símbolo de moeda e substitui a vírgula por ponto
    const normalizedValue = parseFloat(value.toString().replace("R$", "").replace(",", ".").trim());

    // Garante que o resultado é um número válido
    return isNaN(normalizedValue) ? 0 : normalizedValue;
}



module.exports = { callFinesPanel, processFinesPanel };