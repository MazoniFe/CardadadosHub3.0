const xml2js = require('xml2js');

const isXMLResponse = (headers) => {
    try{
    // Verificando se o cabeçalho Content-Type está presente
    if (headers && headers["content-type"] || headers.date["content-type"]) {
        const contentType = headers["content-type"] || headers.date["content-type"];
        // Verificando se o tipo de conteúdo é XML
        return contentType.includes("text/xml") || contentType.includes('text/html');
      }
      // Se o cabeçalho Content-Type não estiver presente, retorna falso
      return false;
    } catch(e) {
        console.error(e);
    }

};

const isXMLData = (data) => {
    // Verificar se a string começa com uma tag XML
    const startTagRegex = /^<\s*[^ >]+[^>]*>/;
    // Verificar se a string termina com uma tag XML
    const endTagRegex = /<\s*\/\s*[^ >]+[^>]*>$/;
    
    // Se a string contiver tanto uma tag de abertura quanto uma de fechamento, provavelmente é XML
    return startTagRegex.test(data) && endTagRegex.test(data);
};

const extractDataFromXML = async (xml) => {
    try {
        const parser = new xml2js.Parser();
        // Analisar a resposta XML para obter um objeto JavaScript
        const parsedXML = await parser.parseStringPromise(xml);

        // Verificar se as propriedades necessárias estão presentes
        if (parsedXML && parsedXML['soap:Envelope'] && parsedXML['soap:Envelope']['soap:Body']) {
            // Aqui você pode aplicar a lógica para identificar e extrair os dados relevantes
            // por exemplo, você pode percorrer recursivamente o objeto XML e extrair todos os valores de texto encontrados

            const extractedData = extractXMLValues(parsedXML['soap:Envelope']['soap:Body'][0]);
            return extractedData[0];
        } else {
            return parsedXML;
        }
    } catch (error) {
        console.error("Erro ao analisar a resposta XML:", error);
        return null;
    }
};

// Função recursiva para extrair valores de texto do objeto XML
const extractXMLValues = (obj) => {
    try {
        let values = {};

        // Iterar sobre todas as chaves do objeto
        Object.keys(obj).forEach(key => {
            const value = obj[key];

            // Verificar se o valor é um objeto ou array
            if (typeof value === 'object') {
                // Se for um objeto ou array, chamamos recursivamente a função
                const nestedValues = extractXMLValues(value);
                // Adicionamos os valores retornados ao objeto atual
                Object.assign(values, nestedValues);
            } else if (typeof value === 'string') {
                // Se for uma string, adicionamos à lista de valores
                values[key] = value;
            }
        });

        return values;
    } catch (e) {
        console.error(e);
        return {};
    }
}


module.exports = { isXMLResponse, extractDataFromXML, isXMLData };
