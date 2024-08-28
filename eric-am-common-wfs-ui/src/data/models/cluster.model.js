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

/**
 * This class responsible for cluster model
 *
 * Example of data { "id": 12, "name": "cluster12.config", "status": "NOT_IN_USE", "description": "Description for config file 12", "crdNamespace": "eric-crd-ns", "isDefault": false, "isCompatible": true, "version": "1.26" }
 * @class ClusterModel
 */
export default class ClusterModel {
  rawData = null;

  constructor(data) {
    this.rawData = data;

    const {
      id,
      description = '',
      crdNamespace,
      name,
      status,
      isDefault,
      isCompatible,
      version,
      selected = false,
    } = this.rawData;

    this.id = id;
    this.description = description;
    this.crdNamespace = crdNamespace;
    this.name = removeExtension(name);
    this.nameWithExtension = name;
    this.status = status === 'IN_USE' ? 'In use' : 'Not in use';
    this.isDefault = isDefault === true ? 'Yes' : 'No';
    this.isDefaultBoolean = isDefault;
    this.isCompatible = isCompatible === true ? 'Yes' : 'No';
    this.version = Number(version) || 0;
    this.selected = selected;
  }
}

// TODO need more elegant solution.
function removeExtension(value) {
  const lastIndex = value.lastIndexOf('.');
  if (lastIndex === -1) {
    return value;
  }
  return value.substring(0, lastIndex);
}
