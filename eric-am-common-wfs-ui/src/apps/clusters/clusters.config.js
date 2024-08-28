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
export const UPGRADE_CLUSTER_CONFIG = 'Update cluster config';
export const UPGRADE_DEFAULT_CLUSTER_CONFIG = 'Make default';
export const DEREGISTER_CLUSTER = 'Deregister cluster';
export const CLUSTER_RESOURCE_NAME = 'E-VNFM Cluster Configuration Resource';

export const CLUSTER_CONTEXT_MENU_ACTIONS = [
  {
    value: 'update-cluster-config',
    label: UPGRADE_CLUSTER_CONFIG,
    rsname: CLUSTER_RESOURCE_NAME,
    scope: 'PUT',
  },
  {
    value: 'make-default',
    label: UPGRADE_DEFAULT_CLUSTER_CONFIG,
    rsname: CLUSTER_RESOURCE_NAME,
    scope: 'PATCH',
  },
  {
    value: 'deregister-cluster',
    label: DEREGISTER_CLUSTER,
    rsname: CLUSTER_RESOURCE_NAME,
    scope: 'DELETE',
  },
];

export const DEFAULT_COLUMNS_STATE = [
  {
    title: 'Cluster name',
    attribute: 'name',
    sortable: true,
    cell: row => {
      const items = CLUSTER_CONTEXT_MENU_ACTIONS.filter(
        actionScopeFilter,
      ).filter(actionClusterFilter.bind(null, row));

      return html`<e-context-cell
        class="table__cell"
        .row=${row}
        .items=${items}
      ></e-context-cell>`;
    },
  },
  { title: 'Usage state', attribute: 'status', sortable: true },
  { title: 'CRD namespace', attribute: 'crdNamespace', sortable: true },
  {
    title: 'Is default',
    attribute: 'isDefault',
    sortable: false,
    cell: row =>
      html`<e-yes-no-status
        class="table__cell"
        .status=${row.isDefault}
      ></e-yes-no-status>`,
  },
  { title: 'Description', attribute: 'description', sortable: false },
];

export const DETAILS_SCHEMA = [
  {
    filed: 'name',
    type: 'text',
  },
  {
    filed: 'isDefault',
    type: 'status',
    status: 'YesNoStatus',
  },
  {
    filed: 'status',
    type: 'text',
  },
  {
    filed: 'crdNamespace',
    type: 'text',
  },
  {
    filed: 'description',
    type: 'text',
  },
];
