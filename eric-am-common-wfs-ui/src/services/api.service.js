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

// common libraries
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// services
import ErrorService, { ERROR_TYPES } from './error.service';

class RequestService {
  constructor(opts) {
    this.service = axios.create(opts);

    this.service.interceptors.request.use(
      this.requestSuccess,
      this.requestError,
    );
    this.service.interceptors.response.use(
      this.responseSuccess,
      this.responseError,
    );
  }

  requestSuccess(config) {
    const blackListForIdempotency = ['get', 'head'];
    const { method } = config;

    if (!blackListForIdempotency.includes(method)) {
      config.headers['Idempotency-key'] = uuidv4();
    }

    return config;
  }

  requestError(error) {
    Promise.reject(error);
  }

  responseSuccess(response) {
    const { data = '' } = response || {};

    // if token expired, do redirect to login page
    if (String(data).includes('IDENTITY AND ACCESS MANAGEMENT')) {
      location.reload(); // eslint-disable-line
    }

    return response;
  }

  responseError(error) {
    const wrapperdError = new ErrorService({ error, type: ERROR_TYPES.Axios });

    return Promise.reject(wrapperdError);
  }
}

export default RequestService;
