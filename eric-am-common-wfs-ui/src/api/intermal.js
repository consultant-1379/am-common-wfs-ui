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
import RequestService from '../services/api.service';

const INTERNAL_BASE = '/vnfm/container/api/v1';

const request = new RequestService({
  baseURL: INTERNAL_BASE,
}).service;

/**
 * Fetch all operations
 *
 * @param {object} params - object with query params for request
 *
 * @returns {object}
 */
export async function fetchOperations(params = {}) {
  const response = await request({
    method: 'get',
    url: `/operations`,
    params,
  });

  return response.data;
}

/**
 * Fetch all resources
 *
 * @param {object} params - object with query params for request
 *
 * @returns {object}
 */
export async function fetchResources(params = {}) {
  const response = await request({
    method: 'get',
    url: `/resources`,
    params,
  });

  return response.data;
}

/**
 * Fetch resource info
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchResource(payload = {}) {
  const { resourceId } = payload;
  const response = await request({
    method: 'get',
    url: `/resources/${resourceId}`,
  });

  return response.data;
}

/**
 * Fetch rollback info from resource
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchRollbackInfo(payload = {}) {
  const { resourceId } = payload;
  const response = await request({
    method: 'get',
    url: `/resources/${resourceId}/rollbackInfo`,
  });

  return response.data;
}

/**
 * Fetch downgrade info from resource
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchDowngradeInfo(payload = {}) {
  const { resourceId } = payload;
  const response = await request({
    method: 'get',
    url: `/resources/${resourceId}/downgradeInfo`,
  });

  return response.data;
}

/**
 * Fetch scale info from resource
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchScaleInfo(payload = {}) {
  const { resourceId, params } = payload;
  const response = await request({
    method: 'get',
    url: `/resources/${resourceId}/vnfcScaleInfo`,
    params,
  });

  return response.data;
}

/**
 * Fetch pods from resource
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchPods(payload = {}) {
  const { resourceId } = payload;
  const response = await request({
    method: 'get',
    url: `/resources/${resourceId}/pods`,
  });

  return response.data;
}
