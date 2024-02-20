const { mapJSONWithTextPropRecursive, isJSON, findPropertyInJSON, convertXMLToJson } = require("./JsonUtils");
const { fixSingleDepthArrays } = require("./PrimitiveUtils");
const js2xmlparser = require("js2xmlparser");
const { isXMLData } = require("./XmlUtils");

const getRequestFlow = (reqBody) => {
  if (
    reqBody.tipo != null && reqBody.tipo != undefined &&
    reqBody.tipo.toLowerCase().trim() == "orquest" &&
    ["agregados", "estadual", "nacional"].includes(reqBody.ambito)
  ) {
    return "orquest";
  } else if (
    reqBody.tipo != null && reqBody.tipo != undefined &&
    reqBody.tipo.toLowerCase().trim()  == "painelmultas" &&
    ["agregados", "estadual", "nacional"].includes(reqBody.ambito)
  ) {
    return "painelMultas";
  } else {
    return "individual";
  }
};

const buildAPIResponse = async (apiResponse, outputFormat) => {
  let returnValue = null;
  let mappedResult = apiResponse;

  if(isXMLData(mappedResult)) 
  mappedResult = await convertXMLToJson(mappedResult);

   mappedResult = mappedResult.NewDataSet
    ? mapJSONWithTextPropRecursive(mappedResult).NewDataSet
    : mapJSONWithTextPropRecursive(mappedResult);
    mappedResult = fixSingleDepthArrays(mappedResult);

    try {
    switch (outputFormat) {
      case "JSON":
        returnValue = JSON.parse(JSON.stringify(mappedResult));
        break;
      case "XML":
        returnValue = js2xmlparser
          .parse("Data", returnValue)
          .replace("<?xml version='1.0'?>", "");
        break;
      default:
        console.log("outputFormat Invalido");
        break;
    }

    return returnValue;
  } catch (e) {
    console.log(`Algo deu errado durante o build da response. ${e.message}`);
  }
};

const buildURL = (supplier, parameter, parent) => {
  let url = supplier.url;
  let placeholder;
  for (let type of supplier.tipos) {
    let value;
    if (parent != null || parent != undefined) {
      if (type.toLowerCase() == "cnpj" || type.toLowerCase() == "cpf") {
        value =
          findPropertyInJSON(parent, "cpf") ||
          findPropertyInJSON(parent, "cnpj") ||
          findPropertyInJSON(parent, "ndocumento") ||
          findPropertyInJSON(parent, "cpf_cnpj");
      } else {
        value =
          parent[`${type.toLowerCase()}`] ||
          parameter[`${type.toLocaleString()}`];
      }
    } else {
      value = parameter[`${type.toLowerCase()}`];
    }
    placeholder = `{{!${type.toLowerCase()}!}}`;
    if (supplier.tipo_requisicao === "POST" && supplier.Post_Body) {
      supplier.Post_Body = supplier.Post_Body.replace(placeholder, value);
    } else {
      url = url.replace(new RegExp(placeholder, "g"), value);
    }
  }
  return url;
};

const buildHeadersAndData = (headers, data) => {
  let returnObject = { headers: null, data: null };

  if (isJSON(headers) && headers !== undefined) {
    returnObject.headers = JSON.parse(headers);
  } else returnObject.headers = headers;

  if (isJSON(data) && data !== undefined) returnObject.data = JSON.parse(data);
  else if (data !== undefined) returnObject.data = data;
  else returnObject.data = null;

  return returnObject;
};

const responseIsValid = (response, api) => {
  if (response.status != (api.sucesso_status || 200)) {
    return false;
  }

  if (api.sucesso_conter && !response.data.includes(api.sucesso_conter)) {
    return false;
  }

  if (api.erro_conter && response.data.includes(api.erro_conter)) {
    return false;
  }

  return true;
};

const isRequestFailed = (supplier, apiResponse) => {
  const operator = getSupplierOperator(supplier);
  const erroConterSplit = supplier.erro_conter.split(operator);
  const errorProperty = erroConterSplit[0];
  const errorValue = erroConterSplit[1];
  const existsErrorConterProperty =
    findPropertyInJSON(apiResponse, errorProperty) != undefined &&
    findPropertyInJSON(apiResponse, errorProperty) != null;


  const filterErrorConterPropertyFromAPI = findPropertyInJSON(
    apiResponse,
    errorProperty
  );

  return (
    existsErrorConterProperty &&
    operatorComparer(filterErrorConterPropertyFromAPI, errorValue, operator)
  );
};

const getSupplierOperator = (supplier) => {
  if (supplier.erro_conter.includes("!=")) {
    return "!=";
  } else {
    return "==";
  }
};

const operatorComparer = (var1, var2, sinal) => {
  switch (sinal) {
    case "!=":
      return var1 != var2;
    case "==":
      return var1 == var2;
    default:
      return var1 === var2;
  }
};

module.exports = {
  getRequestFlow,
  buildAPIResponse,
  buildURL,
  buildHeadersAndData,
  responseIsValid,
  isRequestFailed
};
