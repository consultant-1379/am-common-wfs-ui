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
import RequestService from "../utils/api.service";

const ONBOARDING_BASE = "/vnfm/onboarding/api";

const request = new RequestService({
  baseURL: ONBOARDING_BASE
}).service;

export const OPERATION_TYPES = Object.freeze({
  INSTANTIATE: "instantiate",
  UPGRADE: "upgrade",
  TERMINATE: "terminate",
  SCALE: "scale",
  HEAL: "heal",
  CHANGE_PACKAGE: "change_package",
  ROLLBACK: "rollback"
});

/**
 * Fetch information about packages
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchPackages(params = {}) {
  const response = await request({
    method: "get",
    url: `/v2/packages`,
    params
  });

  return response.data;
}

/**
 * Fetch information about package
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchPackage(params = {}) {
  const { packageId } = params;
  const response = await request({
    method: "get",
    url: `/v2/packages/${packageId}`
  });

  return response.data;
}

/**
 * Fetch additional information about package
 *
 * @param {object} payload - object with required params for request
 *
 * @returns {object}
 */
export async function fetchPackageInfo(payload = {}) {
  const { packageId } = payload;
  const response = await request({
    method: "get",
    url: `/vnfpkgm/v1/vnf_packages/${packageId}`
  });

  return response.data;
}

/**
 * Fetch information about supported operation for package
 *
 * @param {object} params - object with required params for request
 * @param {string} params.packageId - the id of the package
 *
 * @returns {object}
 */
export async function fetchPackageSupportedOperation(params) {
  const { packageId } = params;
  const response = await request({
    method: "get",
    url: `/v1/packages/${packageId}/supported_operations`
  });

  return response.data;
}

/**
 * Fetch information about additional parameters
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function fetchAdditionalParameters(params) {
  const { packageId, operation } = params;
  const response = await request({
    method: "get",
    url: `/v1/packages/${packageId}/${operation}/additional_parameters`
  });

  return response.data;
}

/**
 * Delete package
 *
 * @param {object} payload - object with required params for request
 *
 * @returns {object}
 */
export async function deletePackage(payload = {}) {
  const { packageId } = payload;
  const response = await request({
    method: "delete",
    headers: { "Content-Type": "application/json" },
    url: `/vnfpkgm/v1/vnf_packages/${packageId}`
  });

  return response.data;
}

/**
 * Create package
 *
 * @param {object} data - object with required params for request
 *
 * @returns {object}
 */
export async function postPackage(data = {}) {
  const response = await request({
    method: "post",
    headers: { "Content-Type": "application/json" },
    url: `/vnfpkgm/v1/vnf_packages`,
    data
  });

  return response.data;
}

/**
 * Upload package
 *
 * @param {object} payload - object with required params for request
 *
 * @returns {object}
 */
export async function putPackage(payload = {}) {
  const { packageId, onUploadProgress, ...data } = payload;
  const response = await request({
    method: "put",
    headers: { "Content-Type": "application/octet-stream" },
    url: `/vnfpkgm/v1/vnf_packages/${packageId}/package_content`,
    data,
    onUploadProgress
  });

  return response.data;
}
