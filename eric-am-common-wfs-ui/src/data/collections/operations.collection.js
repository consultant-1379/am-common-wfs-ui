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

// api
import { fetchOperations } from '../../api/intermal';

// models
import OperaionModel from '../models/operaion.model';

/**
 * This class responsible for operaitons collection
 *
 * @class OperationsCollection
 */
export default class OperationsCollection {
  rawData = {};
  parsedOperations = [];
  selectedId = null;

  get pagination() {
    return this?.rawData?.page || {};
  }

  setSelectedId(value) {
    this.selectedId = value;
    this.setParsedOperations();
  }

  setParsedOperations() {
    const operaitons = this?.rawData?.items || [];

    this.parsedOperations = operaitons.map(operation => {
      const operationObj = new OperaionModel(operation);

      return {
        ...operationObj,
        selected: operationObj.id === this.selectedId,
      };
    });
  }

  /**
   * Fetch operations
   *
   * @returns {object}
   */
  async fetch(payload) {
    this.rawData = await fetchOperations(payload);
    this.setParsedOperations();
  }
}
