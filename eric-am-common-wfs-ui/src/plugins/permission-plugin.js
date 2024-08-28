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

// models
import { userModel } from '../data/models/user.model';

// api
import { postToken } from '../api/common';

const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:uma-ticket';
const AUDIENCE = window?.__ENVS__?.audience || 'eo';

/**
 * Lifecycle hook executed automatically before
 * the Container loads.
 * Implement this function when you want code in
 * the plugin to execute before the Container loads.
 *
 * @function onBeforeContainerLoad
 * @params {Object} params - { store }
 * @public
 */
export const onBeforeContainerLoad = params => async resolve => {
  await postUserCreds();

  resolve();
};

/**
 * Lifecycle hook executed automatically before each
 * App loads.
 * Implement this function when you want code in
 * the plugin to execute before each and every App loads.
 *
 * @function onBeforeAppLoad
 * @param {Object} params - { appName, parentInfo, path, store }
 * @public
 */
export const onBeforeAppLoad = params => (resolve, reject) => {
  // TODO validate token
  resolve();
};

/**
 * Claim user permission
 *
 * @function postUserCreds
 * @private
 */
async function postUserCreds() {
  const payload = {
    grant_type: GRANT_TYPE,
    audience: AUDIENCE,
  };

  try {
    const response = await postToken(payload);

    userModel.setRawData(response);
  } catch (error) {
    console.error(error);
  }
}
