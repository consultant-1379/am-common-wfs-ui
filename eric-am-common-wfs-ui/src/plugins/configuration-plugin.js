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
import { storage, STORAGE_KEYS } from '../services/storage.service';

// api
import { fetchConfiguration } from '../api/common';

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
  await fetchData();

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
  resolve();
};

/**
 * Fetch basic internal configuration
 *
 * @function fetchConfiguration
 * @private
 */
async function fetchData() {
  try {
    const response = await fetchConfiguration();

    storage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(response));
  } catch (error) {
    console.error(error);
  }
}
