const xml2js = require('xml2js');

// Função para encontrar uma propriedade em um objeto JSON
const findPropertyInJSON = (jsonObj, targetProperty) => {
    let foundValue = null;


    const searchRecursive = (data, parts) => {
        if (data !== null && typeof data === 'object') {
            for (const key in data) {
                const lowerCaseKey = key.toLowerCase();
                if (lowerCaseKey === parts[0].toLowerCase()) {
                    if (parts.length === 1) {
                        foundValue = data[key];
                        return;
                    } else {
                        searchRecursive(data[key], parts.slice(1));
                    }
                }
                searchRecursive(data[key], parts);
            }
        }
    }
    

    const targetParts = targetProperty && typeof(targetProperty) == "string" ? targetProperty.split('-') : [];
    if (targetParts.length > 0) {
        searchRecursive(jsonObj, targetParts);
    }

    return foundValue;
}

const applyTrimToJSONStrings = (data) => {
    // Verifica se o dado é uma string e aplica trim
    if (typeof data === 'string') {
        return data.trim();
    }
    
    // Verifica se o dado é um array e aplica o trim em cada elemento
    if (Array.isArray(data)) {
        return data.map(item => applyTrimToJSONStrings(item));
    }
    
    // Verifica se o dado é um objeto e aplica o trim em cada valor
    if (data !== null && typeof data === 'object') {
        const trimmedObject = {};
        for (const key in data) {
            trimmedObject[key] = applyTrimToJSONStrings(data[key]);
        }
        return trimmedObject;
    }
    
    // Retorna o dado sem alteração caso não seja uma string, array ou objeto
    return data;
}

// Função para preencher arrays vazios com um objeto
const fillEmptyArraysWithObject = (jsonData) => {
    if (Array.isArray(jsonData)) {
        // Se for um array vazio, retorne um array com um objeto vazio
        if (jsonData.length === 0) {
            return [
                {
                    "Mensagem": "Nao Informado!"
                }
            ];
        }
        // Caso contrário, mapeie cada elemento do array e preencha com objetos vazios
        return jsonData.map(item => fillEmptyArraysWithObject(item));
    } else if (typeof jsonData === 'object' && jsonData !== null) {
        // Se for um objeto, mapeie cada valor e preencha com objetos vazios
        const result = {};
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                result[key] = fillEmptyArraysWithObject(jsonData[key]);
            }
        }
        return result;
    } else {
        // Se for qualquer outro tipo de dado, retorne o valor original
        return jsonData;
    }
}

// Função para verificar se uma string é JSON válida
const isJSON = (text) => {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

const convertXMLToJson = (xml) => {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xml, (err, result) => {
            if (err) {
                console.error("Erro ao analisar a resposta XML:", err);
                reject(err);
            } else {
                // Converter o objeto JavaScript em JSON
                const jsonResult = JSON.parse(JSON.stringify(result));
                resolve(jsonResult);
            }
        });
    });
};

const mapJSONWithTextPropRecursive = (json) => {
    if (typeof json !== 'object') {
        return json;
    }

    if ('_text' in json) {
        return json._text;
    }
    for (let key in json) {
        json[key] = mapJSONWithTextPropRecursive(json[key]);
    }

    return json;
}

const editAllJsonProperties = (json, newValue) => {
    try {
        let response = json;
        for (const key in response) {
            response[key] = newValue;
        }
        return response;
    } catch(err) {
        console.error(err);
    }

}

module.exports = {findPropertyInJSON, fillEmptyArraysWithObject, isJSON, mapJSONWithTextPropRecursive, convertXMLToJson, editAllJsonProperties, applyTrimToJSONStrings}