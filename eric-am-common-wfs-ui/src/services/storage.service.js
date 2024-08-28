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

class StorageService {
  setItem(key, data) {
    return window.sessionStorage.setItem(key, data);
  }

  getItem(key) {
    return window.sessionStorage.getItem(key);
  }

  getItemObj(key) {
    const rawData = window.sessionStorage.getItem(key);

    try {
      return JSON.parse(rawData);
    } catch {
      return {};
    }
  }

  removeItem(key) {
    return window.sessionStorage.removeItem(key);
  }

  removeItems(keys) {
    if (Array.isArray(keys)) {
      keys.forEach(key => window.sessionStorage.removeItem(key));

      return true;
    }

    return window.sessionStorage.removeItem(keys);
  }

  clearStorage() {
    return window.sessionStorage.clear();
  }
}

const storage = new StorageService();
const STORAGE_KEYS = Object.freeze({
  CONFIG: '_evnfm-config',
  ACTION_ROW_DATA: '_evnfm-action-row-data',
  SELECTED_ROW: '_evnfm-selected_row',
  CLUSTER_FILTER: '_evnfm-cluster-filter',
});

export { storage, STORAGE_KEYS };
