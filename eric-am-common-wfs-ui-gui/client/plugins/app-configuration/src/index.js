/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */
const Axios = require("axios");

const onBeforeAppLoad = () => async resolve => {
  resolve();
};

function executeSimpleGetRequest(url) {
  return Axios.get(url);
}

function storeAppConfiguration(data, store) {
  store.setState("appConfiguration", data);
  window.localStorage.setItem("version", data.version);
}

function _successCallback(response, store) {
  storeAppConfiguration(response.data, store);
}

function _errorCallback(error) {
  console.log(error);
}

const onBeforeContainerLoad = params => async (resolve, reject) => {
  try {
    const host = window.location.origin;
    const url = `${host}/vnfm/container/info/v1/configurations`;
    const response = await executeSimpleGetRequest(url);
    _successCallback(response, params.store);
    resolve();
  } catch (error) {
    _errorCallback(error);
    reject(new Error("Rejected App loading."));
  }
};

module.exports = {
  onBeforeContainerLoad,
  onBeforeAppLoad
};
