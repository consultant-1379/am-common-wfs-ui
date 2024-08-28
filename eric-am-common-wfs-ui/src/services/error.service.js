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

/**
 * ERR_001 - no code and "message" is empty
 * ERR_010 - error code when failed to set the default cluster
 */
const ERROR_CODES = Object.freeze({
  ERR_001: 'ERR_001',
  ERR_002: 'ERR_002',
  ERR_010: 'ERR_010',
});

export const ERROR_TYPES = Object.freeze({
  Axios: 'axios',
  Exception: 'exception',
});

export default class ErrorService extends Error {
  status;
  messageForDebug;
  messages;
  messageEVNFM;
  type;
  code;
  response;
  params;

  constructor(params) {
    super(params.error);

    const { type, error } = params;

    if (ERROR_TYPES.Axios === type) {
      this.parseAxiosError(error);
    }

    if (ERROR_TYPES.Exception === type) {
      // TODO
    }
  }

  parseAxiosError(error) {
    const { response, code, type, message } = error;
    const { data = {}, status = 200, config, statusText } = response;
    const { messages = [] } = data || {};
    const { url, method } = config;

    this.name = 'EVNFMErrorService';
    this.status = status;
    this.response = response;
    this.type = type;
    this.messageForDebug = message;
    this.messages = messages;
    this.url = url;
    this.messageEVNFM = this.initEVNFMMessage({ data, statusText });

    this.initEVNFMCode({
      code,
      parsedMessage: this.messageEVNFM,
      status,
      url,
      method,
    });
  }

  initEVNFMMessage(params) {
    const { data, statusText } = params;
    const { message, detail, errorDetails = [] } = data || {};

    if (message || detail) {
      return message || detail;
    }

    if (errorDetails.length) {
      return errorDetails.filter(item => item.message).join(', ');
    }

    return statusText;
  }

  initEVNFMCode(params) {
    const { code, parsedMessage, method } = params;

    if (!code && !parsedMessage) {
      this.code = ERROR_CODES.ERR_002;

      return true;
    }

    switch (true) {
      case method === 'patch' && this.isClusterAction:
        this.code = ERROR_CODES.ERR_010;
        break;
      default:
        this.code = ERROR_CODES.ERR_002;
    }
  }

  get isClusterAction() {
    return Boolean(this?.url?.includes('/clusterconfigs'));
  }
}
