const { findPropertyInJSON } = require("./JsonUtils");

const fixSingleDepthArrays = (object) => {
    if (typeof object !== 'object') {
        return object;
    }

    if (Array.isArray(object)) {
        if (object.length === 1) {
            return fixSingleDepthArrays(object[0]);
        } else {
            for (let i = 0; i < object.length; i++) {
                object[i] = fixSingleDepthArrays(object[i]);
            }
            return object;
        }
    }

    for (let key in object) {
        object[key] = fixSingleDepthArrays(object[key]);
    }

    return object;
}


const getErrorMessageResponse = (response) => {
    return findPropertyInJSON(response, "Mensagem") || findPropertyInJSON(response, "code_message") || findPropertyInJSON(response, "MSG_ERRO") || findPropertyInJSON(response, "Resposta") || "Nao informado!";
}

const compareOrder = (a, b) => {
    const ordemA = (a.ordem || a.Ordem || '').toLowerCase();
    const ordemB = (b.ordem || b.Ordem || '').toLowerCase();

    if (ordemA < ordemB) {
        return -1;
    }
    if (ordemA > ordemB) {
        return 1;
    }
    return 0;
}


module.exports = {fixSingleDepthArrays , compareOrder, getErrorMessageResponse};