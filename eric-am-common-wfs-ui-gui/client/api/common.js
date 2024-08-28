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

const request = new RequestService({
  baseURL: "/"
}).service;

/**
 * Fetch documentation
 *
 * @param {object} params - object with query params for request
 *
 * @returns {object}
 */
export async function fetchMDFile(params = {}) {
  const { filename } = params;
  const url = `${window.location.origin}${window.location.pathname}documentation/${filename}.md`;
  const response = await request({
    method: "get",
    url
  });

  return response.data;
}
