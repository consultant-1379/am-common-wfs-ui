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

// helpers
import { v4 as uuidv4 } from 'uuid';
import { formatDateAndTime } from '../../helpers/time.helper';
import { toTitleCase } from '../../helpers/common.helper';

/**
 * This class responsible for operation model
 *
 * @class OperaionModel
 */
export default class OperaionModel {
  rawData = null;

  constructor(data) {
    this.rawData = data;

    const {
      selected = false,
      automaticInvocation = null,
      cancelMode = null,
      cancelPending = null,
      clusterName = '',
      currentLifecycleOperation = null,
      error = null,
      grantId = null,
      lifecycleOperationType = '',
      namespace = '',
      operationOccurrenceId = '',
      operationParams = null,
      operationState = '',
      startTime = '',
      stateEnteredTime = '',
      username = '',
      vnfInstanceId = '',
      vnfInstanceName = '',
      vnfProductName = '',
      vnfSoftwareVersion = '',
    } = this.rawData;

    this.id = operationOccurrenceId;
    this.selected = selected;
    this.automaticInvocation = automaticInvocation;
    this.cancelMode = cancelMode;
    this.cancelPending = cancelPending;
    this.clusterName = clusterName;
    this.currentLifecycleOperation = currentLifecycleOperation;
    this.error = error;
    this.operationStatusMessage = error;
    this.grantId = grantId;
    this.lifecycleOperationType = toTitleCase(lifecycleOperationType);
    this.namespace = namespace;
    this.operationParams = operationParams;
    this.operationState = toTitleCase(operationState);
    this.startTime = startTime;
    this.stateEnteredTime = formatDateAndTime(stateEnteredTime);
    this.username = username;
    this.vnfInstanceId = vnfInstanceId;
    this.vnfInstanceName = vnfInstanceName;
    this.vnfProductName = vnfProductName;
    this.vnfSoftwareVersion = vnfSoftwareVersion;
  }
}
