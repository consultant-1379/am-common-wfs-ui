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
import { App, html, definition } from '@eui/app';

// components
import { TilePanel } from '@eui/layout/tile-panel';
import { MultiPanelTile } from '@eui/layout/multi-panel-tile';
import { Button } from '@eui/base/button';
import { Notification } from '@eui/base/notification';
import { Loader } from '@eui/base/loader';
import OperaionsTable from '../../components/tables/operations-table/operations-table.js';
import OperaionsDetailsPanel from '../../components/details-panel/operations-details-panel/operations-details-panel.js';
import OperaionsFilterPanel from '../../components/filter-panel/operations-filter-panel/operations-filter-panel.js';

// collections
import OperationsCollection from '../../data/collections/operations.collection.js';

// helpers
import { generateSubtitleByPage } from '../../helpers/common.helper.js';
import { setPaginationData } from '../../helpers/filter.helper.js';
import { SYNC_INTERVAL, DEFAULT_COLUMNS_STATE } from './operations.config.js';

// styles
import style from './operations.css';

/**
 * EvnfmOperations is defined as
 * `<e-operations>`
 *
 * @extends {App}
 */
export default class Operations extends App {
  filterQueryJson = {};
  requestInterval = null;

  constructor() {
    super();

    this.operations = new OperationsCollection();
    this._onRowSelected = this._onRowSelected.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._fetchOperations = this._fetchOperations.bind(this);
    this.setPaginationData = setPaginationData.bind(this);
  }

  static get components() {
    return {
      'e-operations-table': OperaionsTable,
      'eui-multi-panel-tile': MultiPanelTile,
      'eui-tile-panel': TilePanel,
      'eui-notification': Notification,
      'eui-loader': Loader,
      'eui-icon': customElements.get('eui-icon'),
      'eui-button': Button,
      'e-operations-details-panel': OperaionsDetailsPanel,
      'e-operations-filter-panel': OperaionsFilterPanel,
    };
  }

  async didConnect() {
    this.bubble('app:lineage', { metaData: this.metaData });
    this.bubble('app:subtitle', { subtitle: '' });

    await this._fetchOperations();

    this.subtitle = generateSubtitleByPage(this.operations.pagination);
    this.isLoading = false;
  }

  shouldAppDisconnect() {
    // clear state
    clearTimeout(this.requestInterval);
    this.columns = DEFAULT_COLUMNS_STATE;
    this.filterQueryJson = {};
    this.selectedOperation = {};
    this.isLoading = true;
  }

  async _fetchOperations() {
    try {
      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      await this.operations.fetch(this.filterQueryJson);

      this.subtitle = generateSubtitleByPage(this.operations.pagination);

      this.requestInterval = setTimeout(this._fetchOperations, SYNC_INTERVAL);
    } catch (error) {
      // TODO add logger
      console.error('Error when fetching operations data: ', error);
    }
  }

  /**
   * Event handler for `operations-table:filters-changed` event
   *
   * @param {object} data: event object
   */
  async _onFilterChange({ detail }) {
    this.isSoftLoading = true;
    this.selectedOperation = {};
    this.setPaginationData(detail, DEFAULT_COLUMNS_STATE);

    await this._fetchOperations();

    this.isSoftLoading = false;
  }

  _onRowSelected({ detail: model }) {
    const { id = null } = model;
    console.log('model', model);
    // needs to set selected to model
    this.operations.setSelectedId(id);
    this.selectedOperation = model;
  }

  /**
   * Render the <e-operations> app. This function is called each time a
   * prop changes.
   */
  render() {
    return this.isLoading
      ? html`<div class="loader-wrapper">
          <eui-loader size="medium"></eui-loader>
        </div>`
      : html` <eui-multi-panel-tile
          tile-title="Operaions"
          subtitle=${this.subtitle}
        >
          <!-- main panel content -->
          <div slot="content" class="is-display-contents">
            ${this.isSoftLoading
              ? html`<div class="loader-wrapper">
                  <eui-loader size="medium"></eui-loader>
                </div>`
              : html`<e-operations-table
                  .operations=${this.operations}
                  .pagination=${this.operations.pagination}
                  @operaions-table:filters-changed=${this._onFilterChange}
                  @operaions-table:row-selected=${this._onRowSelected}
                ></e-operations-table>`}
          </div>
          <!-- Filter panel -->
          <eui-tile-panel tile-title="Filters" slot="left" icon-name="filter">
            <!-- Filter panel content -->
            <e-operations-filter-panel
              slot="content"
              @operations-filter:changed=${this._onFilterChange}
            ></e-operations-filter-panel>
          </eui-tile-panel>

          <!-- Info panel -->
          <eui-tile-panel
            tile-title="Details"
            slot="right"
            icon-name="info"
            resizable
          >
            <!-- Details panel content-->
            <e-operations-details-panel
              slot="content"
              .data=${this.selectedOperation}
            ></e-operations-details-panel>
          </eui-tile-panel>
        </eui-multi-panel-tile>`;
  }
}

definition('e-operations', {
  style,
  props: {
    subtitle: { attribute: false, type: String, default: '' },
    isLoading: { attribute: false, type: Boolean, default: true },
    isSoftLoading: { attribute: false, type: Boolean, default: false },
    selectedOperation: { attribute: false, type: Object, default: {} },
  },
})(Operations);

Operations.register();
