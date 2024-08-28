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
import ClustersDetailsPanel from '../../components/details-panel/clusters-details-panel/clusters-details-panel.js';
import DeregisterClusterDialog from '../../components/dialogs/deregister-cluster-dialog/deregister-cluster-dialog.js';
import UpdateClusterDialog from '../../components/dialogs/update-cluster-dialog/update-cluster-dialog.js';
import MakeDefaultClusterDialog from '../../components/dialogs/make-default-cluster-dialog/make-default-cluster-dialog.js';
import RegisterClusterDialog from '../../components/dialogs/register-cluster-dialog/register-cluster-dialog.js';
import ClustersFilterPanel from '../../components/filter-panel/clusters-filter-panel/clusters-filter-panel.js';
import ClustersTable from '../../components/tables/clusters-table/clusters-table.js';
import ContextMenu from '../../components/context-menu/context-menu.js';

// collections
import ClustersCollection from '../../data/collections/clusters.collection.js';

// api
import {
  putClusterConfig,
  patchClusterConfig,
  deleteCluster,
  postClusterConfig,
} from '../../api/orchestrator.js';

// helpers
import {
  generateNotificationWithHtml,
  generateNotificationByErrorCode,
} from '../../helpers/notification.helper.js';
import { generateSubtitleByPage } from '../../helpers/common.helper.js';
import { setPaginationData } from '../../helpers/filter.helper.js';
import {
  actionScopeFilter,
  actionClusterFilter,
  checkIsLastRowOnPage,
} from '../../helpers/table.helper.js';
import {
  DEFAULT_COLUMNS_STATE,
  SYNC_INTERVAL,
  CLUSTER_CONTEXT_MENU_ACTIONS, // TODO  remove
} from './clusters.config.js';

// styles
import style from './clusters.css';

/**
 * Clusters is defined as
 * `<e-clusters>`
 *
 * @extends {App}
 */
export default class Clusters extends App {
  filterQueryJson = {};
  requestInterval = null;

  constructor() {
    super();

    this.clusters = new ClustersCollection();
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onRowSelected = this._onRowSelected.bind(this);
    this._fetchClusters = this._fetchClusters.bind(this);
    this._onToggleMakeDefaultDialog =
      this._onToggleMakeDefaultDialog.bind(this);
    this._onToggleUpdateClusterDialog =
      this._onToggleUpdateClusterDialog.bind(this);
    this._onToggleDeregisterDialog = this._onToggleDeregisterDialog.bind(this);
    this._onToggleRegisterDialog = this._onToggleRegisterDialog.bind(this);
    this.setPaginationData = setPaginationData.bind(this);

    this._patchClusterConfig = this._patchClusterConfig.bind(this);
    this._putClusterConfig = this._putClusterConfig.bind(this);
    this._deleteCluster = this._deleteCluster.bind(this);
    this._postClusterConfig = this._postClusterConfig.bind(this);
  }

  static get components() {
    return {
      'e-clusters-table': ClustersTable,
      'e-clusters-details-panel': ClustersDetailsPanel,
      'e-clusters-filter-panel': ClustersFilterPanel,
      'eui-multi-panel-tile': MultiPanelTile,
      'eui-tile-panel': TilePanel,
      'e-deregister-cluster-dialog': DeregisterClusterDialog,
      'e-update-cluster-dialog': UpdateClusterDialog,
      'e-make-default-cluster-dialog': MakeDefaultClusterDialog,
      'e-register-cluster-dialog': RegisterClusterDialog,
      'e-context-menu': ContextMenu,
      'eui-notification': Notification,
      'eui-loader': Loader,
      'eui-icon': customElements.get('eui-icon'),
      'eui-button': Button,
    };
  }

  async didConnect() {
    this.bubble('app:lineage', { metaData: this.metaData });
    this.bubble('app:subtitle', { subtitle: '' });
    this.bubble('app:actions', {
      actions: [this.addClusterButtonEl],
    });

    await this._fetchClusters();

    this.subtitle = generateSubtitleByPage(this.clusters.pagination);
    this.isLoading = false;
  }

  shouldAppDisconnect() {
    // clear state
    clearTimeout(this.requestInterval);
    this.columns = DEFAULT_COLUMNS_STATE;
    this.filterQueryJson = {};
    this.selectedCluster = {};
    this.isLoading = true;
    this.showDeregisterDialog = false;
    this.showMakeDefaultDialog = false;
    this.showUpdateClusterDialog = false;
    this.showRegisterDialog = false;
  }

  get getActionItems() {
    return CLUSTER_CONTEXT_MENU_ACTIONS.filter(actionScopeFilter).filter(
      actionClusterFilter.bind(null, this.selectedCluster),
    );
  }

  get addClusterButtonEl() {
    const buttonEl = this.createElement('eui-button');

    buttonEl.textContent = 'Register cluster';
    buttonEl.primary = true;
    buttonEl.addEventListener('click', event =>
      this._onToggleRegisterDialog({ detail: { show: true } }),
    );

    return buttonEl;
  }

  async _fetchClusters() {
    try {
      if (this.requestInterval) {
        clearTimeout(this.requestInterval);
      }

      await this.clusters.fetch(this.filterQueryJson);

      this.subtitle = generateSubtitleByPage(this.clusters.pagination);

      this.requestInterval = setTimeout(this._fetchClusters, SYNC_INTERVAL);
    } catch (error) {
      // TODO add logger
      console.error('Error when fetching cluster config: ', error);
    }
  }

  /**
   * Event handler for `cluster-table:filters-changed` event
   *
   * @param {object} data: event object
   */
  async _onFilterChange({ detail }) {
    this.isSoftLoading = true;
    this.selectedCluster = {};
    this.setPaginationData(detail, DEFAULT_COLUMNS_STATE);

    await this._fetchClusters();

    this.isSoftLoading = false;
  }

  _onRowSelected({ detail: model }) {
    const { id = null } = model;

    // needs to set selected to model
    this.clusters.setSelectedId(id);
    this.selectedCluster = model;
  }

  _onToggleMakeDefaultDialog({ detail }) {
    const { show } = detail;

    this.showMakeDefaultDialog = show;
  }

  _onToggleUpdateClusterDialog({ detail }) {
    const { show } = detail;

    this.showUpdateClusterDialog = show;
  }

  _onToggleDeregisterDialog({ detail }) {
    const { show } = detail;

    this.showDeregisterDialog = show;
  }

  _onToggleRegisterDialog({ detail }) {
    const { show } = detail;

    this.showRegisterDialog = show;
  }

  async _patchClusterConfig({ detail }) {
    this.isSoftLoading = true;

    try {
      await patchClusterConfig(detail);
      await this._fetchClusters();

      const { clusterName } = detail;

      generateNotificationWithHtml.call(this, {
        title: 'Success',
        description: `Cluster <strong>${clusterName}</strong> has been set as default.`,
      });
    } catch (error) {
      generateNotificationByErrorCode.call(this, error);
      console.error('Error when set default config: ', error);
    } finally {
      this.isSoftLoading = false;
    }
  }

  async _deleteCluster({ detail }) {
    this.isSoftLoading = true;

    try {
      await deleteCluster(detail);

      const page = this.clusters.pagination;

      if (checkIsLastRowOnPage(page)) {
        const prevPage = this.data.page.number - 1;

        this.filterQueryJson =
          this.filterQueryJson?.page > 1
            ? { ...this.filterQueryJson, page: this.filterQueryJson.page - 1 }
            : this.filterQueryJson;
      }

      await this._fetchClusters();

      const { clusterName } = detail;

      generateNotificationWithHtml.call(this, {
        title: 'Success',
        description: `Cluster <strong>${clusterName}</strong> has been deregistered.`,
      });
    } catch (error) {
      generateNotificationByErrorCode.call(this, error);
      console.error('Error when updating cluster config: ', error);
    } finally {
      this.isSoftLoading = false;
    }
  }

  async _putClusterConfig({ detail }) {
    this.isSoftLoading = true;

    try {
      await putClusterConfig(detail);
      await this._fetchClusters();

      const { clusterName } = detail;

      generateNotificationWithHtml.call(this, {
        title: 'Success',
        description: `Cluster config for <strong>${clusterName}</strong> has been updated.`,
      });
    } catch (error) {
      generateNotificationByErrorCode.call(this, error);
      console.error('Error when updating cluster config: ', error);
    } finally {
      this.isSoftLoading = false;
    }
  }

  async _postClusterConfig({ detail }) {
    this.isSoftLoading = true;

    try {
      await postClusterConfig(detail);
      await this._fetchClusters();

      generateNotificationWithHtml.call(this, {
        title: 'Success',
        description: 'Cluster has been registered',
      });
    } catch (error) {
      generateNotificationByErrorCode.call(this, error);
      console.error('Error when updating cluster config: ', error);
    } finally {
      this.isSoftLoading = false;
    }
  }

  /**
   * Render the <e-clusters> app. This function is called each time a
   * prop changes.
   */
  render() {
    return this.isLoading
      ? html`<div class="loader-wrapper">
          <eui-loader size="medium"></eui-loader>
        </div>`
      : html`
          <eui-multi-panel-tile
            tile-title="CISM Clusters"
            subtitle=${this.subtitle}
          >
            <!-- main panel content -->
            <div slot="content" class="is-display-contents">
              ${this.isSoftLoading
                ? html`<div class="loader-wrapper">
                    <eui-loader size="medium"></eui-loader>
                  </div>`
                : html`<e-clusters-table
                    .clusters=${this.clusters}
                    .pagination=${this.clusters.pagination}
                    customRowHeight="45"
                    @cluster-table:filters-changed=${this._onFilterChange}
                    @cluster-table:row-selected=${this._onRowSelected}
                    @context-menu:make-default=${this
                      ._onToggleMakeDefaultDialog}
                    @context-menu:update-cluster-config=${this
                      ._onToggleUpdateClusterDialog}
                    @context-menu:deregister-cluster=${this
                      ._onToggleDeregisterDialog}
                  ></e-clusters-table>`}
            </div>
            <!-- Filter panel -->
            <eui-tile-panel tile-title="Filters" slot="left" icon-name="filter">
              <!-- Filter panel content -->
              <e-clusters-filter-panel
                slot="content"
                @cluster-filter:changed=${this._onFilterChange}
              ></e-clusters-filter-panel>
            </eui-tile-panel>

            <!-- Info panel -->
            <eui-tile-panel
              tile-title="Details"
              slot="right"
              icon-name="info"
              resizable
            >
              <!-- Details panel content-->
              <e-clusters-details-panel
                slot="content"
                .data=${this.selectedCluster}
              ></e-clusters-details-panel>
              ${this.selectedCluster.id
                ? html`<e-context-menu
                    slot="action"
                    .row=${this.selectedCluster}
                    .items=${this.getActionItems}
                    @context-menu:make-default=${this
                      ._onToggleMakeDefaultDialog}
                    @context-menu:update-cluster-config=${this
                      ._onToggleUpdateClusterDialog}
                    @context-menu:deregister-cluster=${this
                      ._onToggleDeregisterDialog}
                  ></e-context-menu>`
                : null}
            </eui-tile-panel>
          </eui-multi-panel-tile>

          <!-- DEREGISTER CLUSTER DIALOG -->
          <e-deregister-cluster-dialog
            .show=${this.showDeregisterDialog}
            @deregister-cluster-dialog:closed=${this._onToggleDeregisterDialog}
            @deregister-cluster-dialog:submit=${this._deleteCluster}
          ></e-deregister-cluster-dialog>

          <!-- SET DEFAULT CLUSTER CONFIG DIALOG -->
          <e-make-default-cluster-dialog
            .show=${this.showMakeDefaultDialog}
            @make-default-cluster-dialog:closed=${this
              ._onToggleMakeDefaultDialog}
            @make-default-cluster-dialog:submit=${this._patchClusterConfig}
          ></e-make-default-cluster-dialog>

          <!-- UPDATE CLUSTER CONFIG DIALOG -->
          <e-update-cluster-dialog
            .show=${this.showUpdateClusterDialog}
            @update-cluster-dialog:closed=${this._onToggleUpdateClusterDialog}
            @update-cluster-dialog:submit=${this._putClusterConfig}
          ></e-update-cluster-dialog>

          <!-- REGISTER CLUSTER CONFIG DIALOG -->
          <e-register-cluster-dialog
            .show=${this.showRegisterDialog}
            @register-cluster-dialog:closed=${this._onToggleRegisterDialog}
            @register-cluster-dialog:submit=${this._postClusterConfig}
          ></e-register-cluster-dialog>
        `;
  }
}

/**
 * @property {String} subtitle - subtitle for application
 * @property {Boolean} isLoading - loading state for CISM clusters page
 * @property {Object} selectedCluster - selected cluster model
 * @property {Boolean} showDeregisterDialog - show state for `e-deregister-cluster-dialog`
 * @property {Boolean} showMakeDefaultDialog - show state for `e-make-default-cluster-dialog`
 * @property {Boolean} showUpdateClusterDialog - show state for `e-update-cluster-dialog`
 * @property {Boolean} showRegisterDialog - show state for `e-register-cluster-dialog`
 */
definition('e-clusters', {
  style,
  props: {
    subtitle: { attribute: false, type: String, default: '' },
    isLoading: { attribute: false, type: Boolean, default: true },
    isSoftLoading: { attribute: false, type: Boolean, default: false },
    selectedCluster: { attribute: false, type: Object, default: {} },
    showDeregisterDialog: { attribute: false, type: Boolean, default: false },
    showRegisterDialog: { attribute: false, type: Boolean, default: false },
    showMakeDefaultDialog: { attribute: false, type: Boolean, default: false },
    showUpdateClusterDialog: {
      attribute: false,
      type: Boolean,
      default: false,
    },
  },
})(Clusters);

Clusters.register();
