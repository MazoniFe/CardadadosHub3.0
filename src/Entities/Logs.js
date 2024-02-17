const { isRequestFailed } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { getFormattedDateTime } = require("../Utils/dateUtils");

class Logs {
    constructor(apiURL, response, supplier, startTimestamp, message) {
        const endTimestamp = Date.now();
        const executionTime = endTimestamp - startTimestamp;
    
        this.scope = supplier.ambito || 'Não informado!';
        this.fornecedor = supplier.fornecedor || 'Não informado!';
        this.consultaUrl = apiURL;
        this.codigoConsulta = supplier.id || 'Não informado!';
        this.logErroConsulta = supplier.erro_conter || 'Não informado!';
        this.parametro = supplier.tipos[0] || "Não informado!";
        
        this.dataHora = getFormattedDateTime();
        this.metodo = response ? response.tipo_requisicao : 'Não informado!';
        this.statusCode = response && response.status ? response.status : "Não informado!";
        this.tempoExecucao = executionTime + "ms";
        this.ordem = supplier.ordem || 'Não informado!';
        this.sucesso_conter = supplier.sucesso_conter || 'Não informado!';
        
        this.status = !isRequestFailed(supplier, response) ? "SUCESSO" : "FALHA";
        this.mensagem = message;
    }

    setMessage(message){
        this.mensagem = message;
    }

    setStatus(status) {
        this.status = status;
    }
}

class LogsError {
    constructor(scope) {
        this.scope = scope;
        this.results = [];
    }

    addLog(log){
        this.results.push(log);
    }
}

module.exports = {Logs, LogsError};