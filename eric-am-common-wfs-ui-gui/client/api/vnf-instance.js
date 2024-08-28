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

const VNF_BASE = "/vnflcm/v1/vnf_instances";

const request = new RequestService({
  baseURL: VNF_BASE
}).service;

/**
 * Initiate terminate operation for specific vnf instance
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postTerminateVnfInstance(params) {
  const { vnfInstanceId, ...data } = params;
  const response = await request({
    headers: { "content-type": "application/json" },
    method: "post",
    url: `/${vnfInstanceId}/terminate`,
    data
  });

  return response.data;
}

/**
 * Initiate deleting node operation for specific vnf instance
 *
 * @param {object} params - object with required params for request
 *
 * @returns {object}
 */
export async function postDeleteNode(params) {
  const { vnfInstanceId } = params;
  const response = await request({
    headers: { "content-type": "application/json" },
    method: "post",
    url: `/${vnfInstanceId}/deleteNode`
  });

  return response.data;
}
