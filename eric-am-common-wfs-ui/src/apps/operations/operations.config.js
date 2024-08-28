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
import { html } from '@eui/lit-component';

// helpers
import {
  actionScopeFilter,
  actionClusterFilter,
} from '../../helpers/table.helper';

export const SYNC_INTERVAL = 5000;
// export const UPGRADE_CLUSTER_CONFIG = 'Update cluster config';
// export const UPGRADE_DEFAULT_CLUSTER_CONFIG = 'Make default';
// export const DEREGISTER_CLUSTER = 'Deregister cluster';
// export const CLUSTER_RESOURCE_NAME = 'E-VNFM Cluster Configuration Resource';

// export const CLUSTER_CONTEXT_MENU_ACTIONS = [
//   {
//     value: 'update-cluster-config',
//     label: UPGRADE_CLUSTER_CONFIG,
//     rsname: CLUSTER_RESOURCE_NAME,
//     scope: 'PUT',
//   },
//   {
//     value: 'make-default',
//     label: UPGRADE_DEFAULT_CLUSTER_CONFIG,
//     rsname: CLUSTER_RESOURCE_NAME,
//     scope: 'PATCH',
//   },
//   {
//     value: 'deregister-cluster',
//     label: DEREGISTER_CLUSTER,
//     rsname: CLUSTER_RESOURCE_NAME,
//     scope: 'DELETE',
//   },
// ];

export const DEFAULT_COLUMNS_STATE = [
  {
    title: 'Resource instance name',
    attribute: 'vnfInstanceName',
    sortable: true,
  },
  { title: 'Cluster', attribute: 'clusterName', sortable: true },
  { title: 'Operation', attribute: 'lifecycleOperationType', sortable: true },
  {
    title: 'Operation state',
    attribute: 'operationState',
    width: '15%',
    sortable: true,
  },
  { title: 'Type', attribute: 'vnfProductName', sortable: true },
  {
    title: 'Software version',
    attribute: 'vnfSoftwareVersion',
    sortable: true,
  },
  { title: 'Timestamp', attribute: 'stateEnteredTime', sortable: true },
  { title: 'Modified by', attribute: 'username', sortable: true },
];

export const DETAILS_SCHEMA = [
  {
    filed: 'vnfInstanceName',
    type: 'text',
  },
  {
    filed: 'lifecycleOperationType',
    type: 'text',
  },
  {
    filed: 'operationState',
    type: 'text',
  },
  {
    filed: 'vnfProductName',
    type: 'text',
  },
  {
    filed: 'vnfSoftwareVersion',
    type: 'text',
  },
  {
    filed: 'stateEnteredTime',
    type: 'text',
  },
  {
    filed: 'username',
    type: 'text',
  },
];
