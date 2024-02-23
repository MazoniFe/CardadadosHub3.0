const { isRequestFailed } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { getFormattedDateTime } = require("../Utils/dateUtils");

class Logs {
    constructor(apiURL, response, supplier, startTimestamp, message) {
        const endTimestamp = Date.now();
        const executionTime = endTimestamp - startTimestamp;
    
        this.scope = supplier != null || supplier != undefined ? supplier.ambito : 'Não informado!';
        this.fornecedor = supplier != null || supplier != undefined ? supplier.fornecedor : 'Não informado!';
        this.consultaUrl = apiURL;
        this.codigoConsulta = supplier != null || supplier != undefined ? supplier.id : 'Não informado!';
        this.logErroConsulta =  supplier != null || supplier != undefined ? supplier.erro_conter : 'Não informado!';
        this.parametro =  supplier != null || supplier != undefined ? supplier.tipos[0] : "Não informado!";

        this.dataHora = getFormattedDateTime();
        this.metodo = supplier && supplier.tipo_requisicao ? supplier.tipo_requisicao : 'Não informado!';
        this.statusCode = response && response.status ? response.status : "Não informado!";
        this.tempoExecucao = executionTime + "ms";
        this.ordem = supplier ? supplier.ordem : 'Não informado!';
        this.sucesso_conter = supplier ? supplier.sucesso_conter :  'Não informado!';

        this.status = supplier && !isRequestFailed(supplier, response) ? "SUCESSO" : "FALHA";
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