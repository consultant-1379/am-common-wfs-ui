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

// services
import RequestService from '../services/api.service';

const request = new RequestService({
  baseURL: '/',
}).service;

/**
 * Fetch documentation
 *
 * @param {object} params - object with query params for request
 *
 * @returns {object}
 * @public
 */
export async function fetchMDFile(params = {}) {
  const { filename } = params;
  const url = `${window.location.origin}${window.location.pathname}documentation/${filename}.md`;
  const response = await request({
    method: 'get',
    url,
  });

  return response.data;
}

/**
 * Fetch configuration
 *
 * @returns {object}
 * @public
 */
export async function fetchConfiguration() {
  const url = `${window.location.origin}/vnfm/container/info/v1/configurations`;
  const response = await request({
    method: 'get',
    url,
  });

  return response.data;
}

/**
 * Claim user token
 *
 * @param {object} payload - object with params for request
 * @property {string} payload.grant_type - param responsible to obtain an access token
 * @property {string} payload.audience - audience, by default equal to `eo`
 *
 * @returns {object}
 * @public
 */
export async function postToken(payload) {
  const url = `${window.location.origin}/oauth2/auth/realms/master/protocol/openid-connect/token`;
  const response = await request({
    method: 'post',
    url,
    data: payload,
  });

  return response.data;
}
