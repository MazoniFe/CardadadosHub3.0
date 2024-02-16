const { isRequestFailed } = require("../Utils/HttpUtils");
const { findPropertyInJSON } = require("../Utils/JsonUtils");
const { getFormattedDateTime } = require("../Utils/dateUtils");

class Logs {
    constructor(apiURL, response, supplier, startTimestamp, message) {
        const endTimestamp = Date.now();
        const executionTime = endTimestamp - startTimestamp;

        this.nomeConsulta = supplier.ambito || 'Não informado!';
        this.consultaUrl = apiURL;
        this.codigoConsulta = supplier.id || 'Não informado!';
        this.logErroConsulta = supplier.erro_conter || 'Não informado!';
        this.supplier = supplier.fornecedor || 'Não informado!';
        this.dataHora = getFormattedDateTime();
        this.parametro = supplier.tipos[0] || "Não informado!"
        this.statusCode = response && response.status ? response.status : "Não informado!";
        this.tempoExecucao = executionTime + "ms";
        this.metodo = response ? response.tipo_requisicao : 'Não informado!';
        this.ordem = supplier.ordem || 'Não informado!';
        this.sucesso_conter = supplier.sucesso_conter || 'Não informado!';
        this.status = !isRequestFailed(supplier, response) ? "SUCESSO" : "FALHA";
        this.mensagem = message;
    }

    setMessage(message){
        this.mensagem = message;
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