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
// import { dataToFormParams } from '../utils/RestUtils';

const ORCHESTRATION_BASE = '/vnflcm/v1';

const request = new RequestService({
  baseURL: ORCHESTRATION_BASE,
}).service;

/**
 * Fetch all clusters
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchClusters(params = {}) {
  const response = await request({
    method: 'get',
    url: `/clusterconfigs`,
    params,
  });

  return response.data;
}

/**
 * Fetch scopes
 *
 * @param {object} params - object with required params for request
 * @param {string} params.instanceId - the id of the package
 *
 * @returns {object}
 */
export async function fetchScopes(params = {}) {
  const response = await request({
    method: 'get',
    url: `/vnf_instances/${params.instanceId}/backup/scopes`,
  });

  return response.data;
}

/**
 * Replace cluster config
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function putClusterConfig(params) {
  const { clusterName, skipSameClusterVerification, ...data } = params;
  const response = await request({
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'put',
    url: `/clusterconfigs/${clusterName}`,
    data: data,
    params: {
      skipSameClusterVerification,
    },
  });

  return response.data;
}

/**
 * Delete cluster
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function deleteCluster(params = {}) {
  const response = await request({
    headers: { 'content-type': 'application/json' },
    method: 'delete',
    url: `/clusterconfigs/${params.clusterName}`,
  });

  return response.data;
}

/**
 * Update cluster config data
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function patchClusterConfig(params) {
  const { clusterName, skipSameClusterVerification, ...data } = params;
  const response = await request({
    headers: { 'Content-Type': 'application/merge-patch+json' },
    method: 'patch',
    url: `/clusterconfigs/${clusterName}`,
    data,
    params: {
      skipSameClusterVerification,
    },
  });

  return response.data;
}

/**
 * Rollback operation
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postRollback(payload) {
  const { vnfLcmOpOccId } = payload;
  const response = await request({
    method: 'post',
    url: `/vnf_lcm_op_occs/${vnfLcmOpOccId}/rollback`,
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

/**
 * Register cluster
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postClusterConfig(data) {
  const response = await request({
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: `/clusterconfigs`,
    data,
  });

  return response.data;
}

/**
 * Force fail action
 *
 * @param {object} payload - object with required params for request
 *
 * @returns {object}
 */
export async function postForceFail(payload) {
  const { vnfLcmOpOccId } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_lcm_op_occs/${vnfLcmOpOccId}/fail`,
  });

  return response.data;
}

/**
 * Post clean up resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postCleanUp(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_instances/${resourceId}/cleanup`,
    data,
  });

  return response.data;
}

/**
 * Post backup resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postBackUp(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_instances/${resourceId}/backups`,
    data,
  });

  return response.data;
}

/**
 * Post sync resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postSync(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_instances/${resourceId}/sync`,
    data,
  });

  return response.data;
}

/**
 * Patch resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function patchResource(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'patch',
    url: `/vnf_instances/${resourceId}`,
    data,
  });

  return response.data;
}

/**
 * Post change resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postChangeResource(payload) {
  const {
    resourceId,
    data,
    headers = { 'Content-Type': 'application/json' },
  } = payload;
  const response = await request({
    headers,
    method: 'post',
    url: `/vnf_instances/${resourceId}/change_vnfpkg`,
    data,
  });

  return response;
}

/**
 * Post scale resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postScaleResource(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_instances/${resourceId}/scale`,
    data,
  });

  return response.data;
}

/**
 * Fetch validate cluster and namespace
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchValidationForClusterAndNamespace(params = {}) {
  const { clusterNameAndNamespace } = params;
  const response = await request({
    method: 'get',
    url: `/validateNamespace/${clusterNameAndNamespace}`,
  });

  return response.data;
}

/**
 * Post export backups resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postExportBackups(payload) {
  const { resourceId, data } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_instances/${resourceId}/backups`,
    data,
  });

  return response.data;
}

/**
 * Delete backup resource
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function deleteBackup(payload) {
  const { resourceId, backupName, scope } = payload;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'delete',
    url: `/vnf_instances/${resourceId}/backups/${backupName}/${scope}`,
  });

  return response.data;
}

/**
 * Fetch operation
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchOperation(params = {}) {
  const { vnfLcmOpOccId } = params;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'get',
    url: `/vnf_lcm_op_occs/${vnfLcmOpOccId}`,
  });

  return response.data;
}

/**
 * Post operation fail
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postOperationFail(params = {}) {
  const { vnfLcmOpOccId } = params;
  const response = await request({
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: `/vnf_lcm_op_occs/${vnfLcmOpOccId}/fail`,
  });

  return response.data;
}

/**
 * Fetch backups from resource
 *
 * @param {object} payload - object with required params for request
 * @property {string} payload.resourceId - resource id
 *
 * @returns {object}
 */
export async function fetchBackups(payload = {}) {
  const { resourceId } = payload;
  const response = await request({
    method: 'get',
    url: `/vnf_instances/${resourceId}/backups`,
  });

  return response.data;
}
