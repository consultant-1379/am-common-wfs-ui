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

const userInformation = { tokenId: Date.now() };

function decodeRptToken(rptToken) {
  const base64Url = rptToken.split(".")[1];
  return JSON.parse(window.atob(base64Url));
}

function storeUserInformation(token, refreshToken, store) {
  userInformation.username = token.preferred_username;
  userInformation.permissions = {};
  userInformation.roles = token.realm_access.roles;
  userInformation.tokenId = Date.now();
  token.authorization.permissions.forEach(resource => {
    if (resource.rsname !== "Default Resource") {
      userInformation.permissions[resource.rsname] = resource.scopes;
    }
  });
  store.setState("userInformation", userInformation);
}

function executeSimplePostRequest(url, data) {
  return Axios.post(url, data);
}

function _successCallback(response, store) {
  const rptToken = decodeRptToken(response.data.access_token);
  const refreshToken = decodeRptToken(response.data.refresh_token);

  storeUserInformation(rptToken, refreshToken, store);
}

function _errorCallback(error) {
  console.log(error);
}

function fetchUserPermissions() {
  const host = window.location.origin;
  const url = `${host}/oauth2/auth/realms/master/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:uma-ticket");
  params.append("audience", "eo");
  return executeSimplePostRequest(url, params);
}

function _getCookie(name) {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

const onBeforeContainerLoad = params => async (resolve, reject) => {
  params.store.setState("userInformation", userInformation);
  const username = _getCookie("userName");
  window.localStorage.setItem("username", username);
  try {
    const response = await fetchUserPermissions();
    _successCallback(response, params.store);
    resolve();
  } catch (error) {
    _errorCallback(error);
    reject(new Error("Rejected App loading."));
  }
};

const onBeforeAppLoad = () => async resolve => {
  resolve();
};

module.exports = {
  onBeforeContainerLoad,
  onBeforeAppLoad
};
