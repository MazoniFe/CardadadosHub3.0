const express = require('express');
const { HttpRequest } = require('./Client/HttpRequest');
const { getRequestFlow } = require('./Utils/HttpUtils');
const { callAPIIndividual } = require('./Services/IndividualService');
const { callAPIOrquest } = require('./Services/OrquestService');
const { callFinesPanel } = require('./Services/FinesPanelService');
const { FinesPanelResponse, CustomResponse, FazendaResponse } = require('./Client/HttpResponses'); // Mova esta linha para cima
const { checkParameters } = require('./Services/ValidateService');
const { callFazenda } = require('./Services/FazendaService');
const { mappingSupplierResponse } = require('./Services/SupplierService');
const detranscResponse = require('./mock/detranscResponse');
const { Logs } = require('./Entities/Logs');
const app = express();
const router = express.Router();

router.post('/buscar', async function (req, res) {
    const httpRequest = new HttpRequest();
    const databaseResponse = await httpRequest.request({ method: 'GET', url: `https://x8ki-letl-twmt.n7.xano.io/api:VV3TxZZv/cadastro_api` });
    const requestFlow = getRequestFlow(req.body);
    let response;

    const validateBody = checkParameters(req.body, databaseResponse.data)

    if (!validateBody.foundError) {
        if (requestFlow == 'individual') {
            const apiRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);
            response = new CustomResponse(apiRequest.response, apiRequest.logs, null, apiRequest.logsError, requestFlow);
        } else if (requestFlow == 'orquest') {
            const parentRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);
            const orquestRequest = await callAPIOrquest(req.body, parentRequest, databaseResponse.data, requestFlow);
            response = new CustomResponse(parentRequest.response, parentRequest.logs, orquestRequest, parentRequest.logsError, requestFlow);
        } else if (requestFlow == 'painelMultas') {
            const parentRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);
            const finelPanelRequest = await callFinesPanel(req.body, parentRequest, databaseResponse.data, requestFlow);
            response = new FinesPanelResponse(parentRequest.response, parentRequest.logs, finelPanelRequest.response, parentRequest.logsError, finelPanelRequest.correctedInfractions);
        } else if (requestFlow == 'fazenda') {
            const parentRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);
            const fazendaRequest = await callFazenda(req.body, parentRequest, databaseResponse.data, requestFlow);
            response = new FazendaResponse(parentRequest.response, parentRequest.logs, fazendaRequest.response, parentRequest.logsError);
        }
    }
    else {
        response = validateBody.data;
    }

    res.status(200).send(response);
});


router.post('/MOCK/API', async function (req, res) {
    const httpRequest = new HttpRequest();
    const databaseResponse = await httpRequest.request({ method: 'GET', url: `https://x8ki-letl-twmt.n7.xano.io/api:VV3TxZZv/cadastro_api` });
    const requestFlow = getRequestFlow(req.body);
    let response;

    const parentRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);
    const supplier = databaseResponse.data.filter(item => item.id === 228)[0];
    const responseData = mappingSupplierResponse(supplier, detranscResponse, parentRequest.logs);
    const logs = new Logs(supplier.url, responseData, supplier, 0, "FAKE MENSAGEM");
    response = {resposne: responseData, logs: logs};

    res.status(200).send(response);
});


app.use(express.json());
app.use('/', router);
app.listen(process.env.port || 3040);
console.log('Server iniciado na Porta 3040');
