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
import { toTitleCase, formatDate, mapSingleOperation } from "../utils/CommonUtils";
export const RESOURCE_PROPERTIES = [
  "instanceId",
  "vnfInstanceName",
  "vnfInstanceDescription",
  "vnfdId",
  "vnfProvider",
  "vnfProductName",
  "vnfSoftwareVersion",
  "instantiationLevel",
  "vnfdVersion",
  "vnfPkgId",
  "clusterName",
  "namespace",
  "instantiationState",
  "addedToOss",
  "instantiateOssTopology",
  "instantiatedVnfInfo",
  "scalingInfo",
  "downgradeSupported",
  "healSupported",
  "lastLifecycleOperation",
  "lastStateChanged",
  "lcmOperationDetails",
  "extensions",
  "supportedOperations"
];
export const RESOURCE_LCM_OPERATION_KEY = "lastLifecycleOperation";

export class Resource {
  constructor(resourceRow) {
    this.lcmOperations = [];
    this.additionalParams = {};
    RESOURCE_PROPERTIES.forEach(rp => (this[rp] = resourceRow[rp]));
    this.setLastLcmOperationDetails(resourceRow);
    this.lcmOperations = resourceRow.lcmOperationDetails.map(operation => {
      return mapSingleOperation(operation, resourceRow);
    });
    this.sourcePackage = `${resourceRow.vnfProvider}.${resourceRow.vnfProductName}.${
      resourceRow.vnfSoftwareVersion
    }.${resourceRow.vnfdVersion}`;
    this.addedToOss =
      `${resourceRow.addedToOss}`[0].toUpperCase() + `${resourceRow.addedToOss}`.slice(1);
    let instantiateOssTopology = resourceRow.instantiateOssTopology;
    this.instantiateOssTopology = instantiateOssTopology;
    let instantiatedVnfInfo = resourceRow.instantiatedVnfInfo;
    this.instantiatedVnfInfo = instantiatedVnfInfo;
    let scalingInfo = resourceRow.scalingInfo;
    this.scalingInfo = scalingInfo;
    this.downgradeSupported = resourceRow.downgradeSupported;
    this.healSupported = resourceRow.healSupported;
    this.instantiationLevel = resourceRow.instantiationLevelId;
    this.lastStateChanged = this.lastStateChanged ? formatDate(this.lastStateChanged) : "";
    this.extensions = resourceRow.extensions;
    this.vnfInstanceDescription = resourceRow.vnfInstanceDescription;
  }

  setLastLcmOperationDetails(resourceRow) {
    if (resourceRow[RESOURCE_LCM_OPERATION_KEY]) {
      const lastLcmOperation = resourceRow[RESOURCE_LCM_OPERATION_KEY];
      this.lifecycleOperationType = toTitleCase(lastLcmOperation.lifecycleOperationType);
      this.operationState = toTitleCase(lastLcmOperation.operationState);
      this.setAdditionalParams(lastLcmOperation);
    }
  }
  setAdditionalParams(lastLcmOperation) {
    const operationParams = lastLcmOperation.operationParams;
    if (operationParams) {
      let additionalParamJson = JSON.parse(operationParams);
      this.additionalParams = additionalParamJson ? additionalParamJson.additionalParams : {};
    }
  }
}
