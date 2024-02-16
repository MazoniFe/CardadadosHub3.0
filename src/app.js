const express = require('express');
const { HttpRequest } = require('./Client/HttpRequest');
const { IndividualResponse } = require('./Client/HttpResponses');
const { getRequestFlow } = require('./Utils/HttpUtils');
const { callAPIIndividual } = require('./Services/APIService');
const app = express();
const router = express.Router();

router.post('/buscar', async function(req, res) {
    const httpRequest = new HttpRequest();
    const databaseResponse = await httpRequest.request({ method: 'GET', url: `https://x8ki-letl-twmt.n7.xano.io/api:VV3TxZZv/cadastro_api` });
    const requestFlow = getRequestFlow(req.body);
    let response;
    
    if(requestFlow == 'individual') {
        const apiRequest = await callAPIIndividual(req.body, null, databaseResponse.data, requestFlow);  
        response = new IndividualResponse(databaseResponse.status, apiRequest.data, apiRequest.logs, apiRequest.logsError);
    } else if (requestFlow == 'orquest') {

    } else if (requestFlow == 'painelMultas'){

    }


    res.status(200).send(response);
});





app.use(express.json());
app.use('/', router);
app.listen(process.env.port || 3040);
console.log('Server iniciado na Porta 3040');
