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
import { LitComponent, html, definition } from '@eui/lit-component';

// components
import { Table, Pagination } from '@eui/table';
import YesNoStatus from '../../statuses/yes-no-status/yes-no-status.js';
import ContextCell from '../../cells/context-cell/context-cell.js';

// helpers
import { DEFAULT_COLUMNS_STATE } from '../../../apps/clusters/clusters.config.js';

// styles
import style from './clusters-table.css';

/**
 * Component ClustersTable is defined as
 * `<e-clusters-table>`
 *
 * @extends {LitComponent}
 */
export default class ClustersTable extends LitComponent {
  constructor() {
    super();

    this.columns = DEFAULT_COLUMNS_STATE;
  }

  // The import.meta object exposes context-specific metadata to a JavaScript module.
  get meta() {
    return import.meta;
  }

  static get components() {
    return {
      'eui-table': Table,
      'eui-pagination': Pagination,
    };
  }

  get parsedClusters() {
    return this.clusters.parsedClusters || [];
  }

  get hasPagination() {
    return Boolean(this.parsedClusters?.length);
  }

  _onChangePage({ detail }) {
    const data = {
      type: 'pagination',
      data: detail.state,
    };

    this.bubble('cluster-table:filters-changed', data);
  }

  _onSelectRow({ detail }) {
    this.bubble('cluster-table:row-selected', detail[0]);
  }

  /**
   * Render the <e-clusters-table> component. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<eui-table
        compact
        dashed
        single-select
        sortable
        .customRowHeight=${38}
        .columns=${this.columns}
        .data=${this.parsedClusters}
        .components=${{
          'e-yes-no-status': YesNoStatus,
          'e-context-cell': ContextCell,
        }}
        @eui-table:row-select=${this._onSelectRow}
      ></eui-table>
      ${this.hasPagination
        ? html`<eui-pagination
            slot="pagination-group"
            current-page=${this.pagination.number}
            num-pages=${this.pagination.totalPages}
            num-entries=${this.pagination.size}
            @eui-table:page-index-change=${this._onChangePage}
          ></eui-pagination>`
        : null} `;
  }
}

/**
 * @property {Object} clusters - clusters list with parsed information
 * @property {Object} pagination - information from request about pagination
 */
definition('e-clusters-table', {
  style,
  props: {
    clusters: { attribute: true, type: Object, default: {} },
    pagination: { attribute: true, type: Object, default: {} },
  },
})(ClustersTable);
