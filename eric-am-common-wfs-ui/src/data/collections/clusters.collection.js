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
import { fetchClusters } from '../../api/orchestrator';

// models
import ClusterModel from '../models/cluster.model';

/**
 * This class responsible for clusters collection
 *
 * @class ClustersCollection
 */
export default class ClustersCollection {
  rawData = {};
  parsedClusters = [];
  selectedId = null;

  get pagination() {
    return this?.rawData?.page || {};
  }

  setSelectedId(value) {
    this.selectedId = value;
    this.setParsedClusters();
  }

  setParsedClusters() {
    const clusters = this?.rawData?.items || [];

    this.parsedClusters = clusters.map(cluster => {
      const clusterObj = new ClusterModel(cluster);

      return {
        ...clusterObj,
        selected: clusterObj.id === this.selectedId,
      };
    });
  }

  /**
   * Fetch clusters
   *
   * @returns {object}
   */
  async fetch(payload) {
    this.rawData = await fetchClusters(payload);
    this.setParsedClusters();
  }
}
