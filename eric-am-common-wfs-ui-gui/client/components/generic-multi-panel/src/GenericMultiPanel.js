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
 * Component GenericMultiPanel is defined as
 * `<e-generic-multi-panel>`
 *
 * Imperatively create component
 * @example
 * let component = new GenericMultiPanel();
 *
 * Declaratively create component
 * @example
 * <e-generic-multi-panel></e-generic-multi-panel>
 *
 * @extends {LitComponent}
 */
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import "@eui/layout";
import "../../generic-table/src/GenericTable";
import "../../details-side-panel/src/DetailsSidePanel";
import "../../resource-details-panel/src/ResourceDetailsPanel";
import "../../context-menu/src/ContextMenu";
import "../../resource-filter-panel/src/ResourceFilterPanel";
import "../../packages-filter-panel/src/PackagesFilterPanel";
import "../../clusters-filter-panel/src/ClustersFilterPanel";
import "../../operations-details-panel/src/OperationsDetailsPanel";
import "../../operations-filter-panel/src/OperationsFilterPanel";
import "../../clusters-details-panel/src/ClustersDetailsPanel";
import "../../banner-component/src/BannerComponent";
import { sortCol, isEmpty } from "../../../utils/CommonUtils";
import style from "./genericMultiPanel.css";
import {
  PACKAGES_PAGE,
  RESOURCES_PAGE,
  OPERATIONS_PAGE,
  CISM_CLUSTERS_PAGE,
  ONBOARDED_PACKAGES,
  NO_RESOURCES_FOUND,
  NO_PACKAGES_FOUND,
  NO_OPERATIONS_FOUND,
  NO_CISM_CLUSTERS_FOUND,
  VERSIONS_OF_PACKAGE
} from "../../../constants/Messages";
import { DELETE_PACKAGE_EVENT } from "../../../constants/Events";

const NO_DATA_MESSAGE = {};
NO_DATA_MESSAGE[RESOURCES_PAGE] = NO_RESOURCES_FOUND;
NO_DATA_MESSAGE[PACKAGES_PAGE] = NO_PACKAGES_FOUND;
NO_DATA_MESSAGE[ONBOARDED_PACKAGES] = NO_PACKAGES_FOUND;
NO_DATA_MESSAGE[VERSIONS_OF_PACKAGE] = NO_PACKAGES_FOUND;
NO_DATA_MESSAGE[OPERATIONS_PAGE] = NO_OPERATIONS_FOUND;
NO_DATA_MESSAGE[CISM_CLUSTERS_PAGE] = NO_CISM_CLUSTERS_FOUND;

/**
 * @property {boolean} pageName - Name of Page.
 * @property {array} data - Table data.
 * @property {boolean} hide - Show side panels.
 * @property {object} selected - Row selected.
 * @property {array} columns - Table columns.
 */
@definition("e-generic-multi-panel", {
  style,
  props: {
    pageName: { attribute: true, type: "string" },
    data: { attributes: true, type: "array", default: [] },
    hide: { attribute: false, type: "boolean", default: true },
    selected: { attribute: false, type: "object", default: {} },
    columns: { attribute: true, type: "array" },
    permissions: { attribute: false, type: "object", default: {} },
    pagination: { attribute: false, type: "object", default: {} },
    subtitle: { attribute: false, type: "string", default: "" },
    availability: { attribute: false, type: "object", default: {} }
  }
})
export default class GenericMultiPanel extends LitComponent {
  constructor() {
    super();
    this.handleEvent = this.handleEvent.bind(this);
    this._setSortedData = this._setSortedData.bind(this);
    this._onSortedByColumn = this._onSortedByColumn.bind(this);
    this._onFiltered = this._onFiltered.bind(this);
    this._onChangePage = this._onChangePage.bind(this);
    this.paginationElement = null;
  }

  handleEvent(event) {
    switch (event.type) {
      case "row-selected":
        if (event.target.hasAttribute("single-select")) {
          this._setSingleRowSelect(event);
        } else {
          this._setSelectedRow(event);
        }
        break;
      case "packageDetails-click": {
        window.EUI.Router.goto(`package-details?id=${event.detail.appPkgId}`);
        break;
      }
      case "instantiatePackage-click": {
        window.EUI.Router.goto(`instantiate-wizard?packageId=${event.detail.appPkgId}`);
        break;
      }
      case "resourceDetails-click": {
        window.EUI.Router.goto(`resource-details?id=${event.detail.instanceId}`);
        break;
      }
      case DELETE_PACKAGE_EVENT: {
        break;
      }
      case "eui-tile-panel:show":
        if (this.pageName === PACKAGES_PAGE) {
          const packageDetailsPanel = this.shadowRoot.querySelector("e-details-side-panel");
          packageDetailsPanel.updateTabs();
        } else if (this.pageName === RESOURCES_PAGE) {
          const resourceDetailsPanel = this.shadowRoot.querySelector("e-resource-details-panel");
          resourceDetailsPanel.updateTabs();
        }
        break;
      default:
        console.log(`Unexpected event [${event.type}] received.`);
    }
  }

  _setSingleRowSelect(event) {
    const selected = event.detail[0];
    this.selected = selected;
  }

  _setSelectedRow(event) {
    if (!this.selectedArray) {
      this.selectedArray = event.detail;
    } else if (event.detail.length === 1) {
      this.selectedArray = [];
      this.selectedArray.push(event.detail[0]);
    } else if (this.selectedArray.length < event.detail.length) {
      this.temp = event.detail.filter(x => !this.selectedArray.includes(x));
      this.selectedArray.push(this.temp[0]);
    } else {
      this.temp = this.selectedArray.filter(x => event.detail.includes(x));
      this.selectedArray = this.temp;
    }
    this.selected = this.selectedArray[this.selectedArray.length - 1];
  }

  componentDidConnect() {
    this.isSorted = false;
    this.sortedEvent = {};
  }

  componentDidReceiveProps(prev) {
    if (prev.pageName && prev.pageName === this.pageName) {
      if (prev.selected && this.selected === prev.selected) {
        this._checkIfAlreadySelected();
      }

      if (this.isSorted) {
        this.setPreviouslySorted();
      }
    }
  }

  componentDidRender() {
    if (!this.paginationElement) {
      this.paginationElement = this.shadowRoot.querySelector("eui-pagination-v0");
    }

    // Updating the numPages prop on pagination component
    if (this.paginationElement) {
      if (this.paginationElement.numPages !== this.pagination.totalPages) {
        this.paginationElement.numPages = this.pagination.totalPages;
      }
    }
  }

  componentWillDisconnect() {
    this.selected = {};
    this.isSorted = false;
    this.sortedEvent = {};
  }

  _setSortedData(event) {
    this.data = sortCol(event);
    this.isSorted = true;
    this.sortedEvent = event;
  }

  _renderTable() {
    switch (this.pageName) {
      case ONBOARDED_PACKAGES:
      case VERSIONS_OF_PACKAGE:
        return html`
          <e-generic-table
            id="wizardPackageTable"
            single-select
            @row-selected="${this.handleEvent}"
            .data=${this.data}
            .columns=${this.columns}
            @eui-table:sort="${this._setSortedData}"
            .pageName=${this.pageName}
          ></e-generic-table>
        `;
      case OPERATIONS_PAGE:
        return html`
          <e-generic-table
            id="operationsTable"
            single-select
            @row-selected="${this.handleEvent}"
            @resourceDetails-click="${this.handleEvent}"
            .permissions=${this.permissions}
            .availability=${this.availability}
            .data=${this.data}
            .columns=${this.columns}
            @eui-table:sort="${this._onSortedByColumn}"
            .pageName=${this.pageName}
          ></e-generic-table>
        `;
      case RESOURCES_PAGE:
        return html`
          <e-generic-table
            id="resourcesTable"
            single-select
            @row-selected="${this.handleEvent}"
            @resourceDetails-click="${this.handleEvent}"
            .data=${this.data}
            .permissions=${this.permissions}
            .availability=${this.availability}
            .columns=${this.columns}
            @eui-table:sort=${this._onSortedByColumn}
            .pageName=${this.pageName}
          ></e-generic-table>
        `;
      case PACKAGES_PAGE:
        return html`
          <e-generic-table
            id="packagesTable"
            single-select
            @row-selected="${this.handleEvent}"
            @packageDetails-click="${this.handleEvent}"
            @instantiatePackage-click="${this.handleEvent}"
            @delete-package="${this}"
            .permissions=${this.permissions}
            .data=${this.data}
            .columns=${this.columns}
            @eui-table:sort="${this._setSortedData}"
            .pageName=${this.pageName}
          ></e-generic-table>
        `;
      case CISM_CLUSTERS_PAGE:
        return html`
          <e-generic-table
            id="clustersTable"
            single-select
            @row-selected="${this.handleEvent}"
            .permissions=${this.permissions}
            .data=${this.data}
            .columns=${this.columns}
            @eui-table:sort=${this._onSortedByColumn}
            .pageName=${this.pageName}
          ></e-generic-table>
        `;
      default:
        return html`
          <e-generic-table></e-generic-table>
        `;
    }
  }

  _checkIfAlreadySelected() {
    switch (this.pageName) {
      case RESOURCES_PAGE:
        this._setPreviouslySelected("instanceId");
        break;
      case OPERATIONS_PAGE:
        this._setPreviouslySelected("operationOccurrenceId");
        break;
      case CISM_CLUSTERS_PAGE:
        this._setPreviouslySelected("name");
        break;
      case PACKAGES_PAGE:
        this._setPreviouslySelected("appPkgId");
        break;
      default:
        this.selected = {};
    }
  }

  _setPreviouslySelected(itemIdentifier) {
    this.data.forEach(item => {
      if (this.selected && this.selected[itemIdentifier] === item[itemIdentifier]) {
        item.selected = true;
        this.selected = item;
      }
    });
    if (!this.selected) {
      this.selected = {};
    }
  }

  setPreviouslySorted() {
    const { column = {} } = this.sortedEvent.detail || {};
    this.sortedEvent.target.data = this.data;
    this.data = sortCol(this.sortedEvent); // TODO remove UI based sorting completely after pagination implemented for packages API
    this.columns = this.columns.map(item => (item.attribute === column.attribute ? column : item));
  }

  _onSortedByColumn({ detail }) {
    const { column = {} } = detail || {};
    const data = {
      type: "sort",
      data: column
    };
    this.bubble("filters-changed", data);
    this.selected = false;
  }

  _onFiltered({ detail }) {
    const data = {
      type: "filter",
      data: detail
    };
    this.bubble("filters-changed", data);
    this.selected = false;
  }

  _onChangePage({ detail }) {
    const data = {
      type: "pagination",
      data: detail.state
    };
    this.bubble("filters-changed", data);
    this.selected = false;
  }

  _renderFilterPanel() {
    return html`
      <eui-layout-v0-tile-panel
        id="filter"
        class="flyoutPanel"
        tile-title="Filters"
        slot="left"
        icon-name="filter"
      >
        <div slot="content">
          ${this._getFilterPanelContent()}
        </div>
      </eui-layout-v0-tile-panel>
    `;
  }

  _getFilterPanelContent() {
    switch (this.pageName) {
      case PACKAGES_PAGE:
      case ONBOARDED_PACKAGES:
      case VERSIONS_OF_PACKAGE:
        return html`
          <e-packages-filter-panel .pageName="${this.pageName}"></e-packages-filter-panel>
        `;
      case RESOURCES_PAGE:
        return html`
          <e-resource-filter-panel @onfiltering=${this._onFiltered}></e-resource-filter-panel>
        `;
      case OPERATIONS_PAGE:
        return html`
          <e-operations-filter-panel @onfiltering=${this._onFiltered}></e-operations-filter-panel>
        `;
      case CISM_CLUSTERS_PAGE:
        return html`
          <e-clusters-filter-panel @onfiltering=${this._onFiltered}></e-clusters-filter-panel>
        `;
      default:
        return html``;
    }
  }

  _renderPanelDetails() {
    switch (this.pageName) {
      case PACKAGES_PAGE:
        return html`
          <e-details-side-panel
            .selected=${this.selected}
            .pageStyle=${"divTableFlyout"}
          ></e-details-side-panel>
        `;
      case RESOURCES_PAGE:
        return html`
          <e-resource-details-panel
            .selected=${this.selected}
            .pageStyle=${"divTableFlyout"}
            .sidePanel=${true}
          ></e-resource-details-panel>
        `;
      case OPERATIONS_PAGE:
        return html`
          <e-operations-details-panel .selected=${this.selected}></e-operations-details-panel>
        `;
      case CISM_CLUSTERS_PAGE:
        return html`
          <e-clusters-details-panel .selected=${this.selected}></e-clusters-details-panel>
        `;
      default:
        return html``;
    }
  }

  _renderPanelContextMenu() {
    if (isEmpty(this.selected) || this.pageName === OPERATIONS_PAGE) {
      return html``;
    }
    return html`
      <e-context-menu
        slot="action"
        id="multipanel-flyout-context-menu"
        .rowData=${this.selected}
        .pageName=${this.pageName}
        .permissions=${this.permissions}
        .availability=${this.availability}
        @packageDetails-click="${this.handleEvent}"
        @resourceDetails-click="${this.handleEvent}"
        @instantiatePackage-click="${this.handleEvent}"
      ></e-context-menu>
    `;
  }

  _renderDetailsPanel() {
    switch (this.pageName) {
      case ONBOARDED_PACKAGES:
      case VERSIONS_OF_PACKAGE:
        return html``;
      default:
        return html`
          <eui-layout-v0-tile-panel
            id="details"
            class="flyoutPanel"
            tile-title="Details"
            subtitle="${this._renderPanelSubtitle()}"
            slot="right"
            icon-name="info"
          >
            <div slot="content">
              ${this._renderPanelDetails()}
            </div>
            ${this._renderPanelContextMenu()}
          </eui-layout-v0-tile-panel>
        `;
    }
  }

  _renderPanelSubtitle() {
    if (isEmpty(this.selected)) {
      return "";
    }

    switch (this.pageName) {
      case PACKAGES_PAGE:
        return this.selected.appCompositeName;
      case RESOURCES_PAGE:
        return this.selected.vnfInstanceName;
      default:
        return "";
    }
  }

  _renderPagination() {
    if (this.pagination && this.pagination.totalPages > 1) {
      return html`
        <eui-pagination-v0
          current-page=${this.pagination.number}
          num-pages=${this.pagination.totalPages}
          num-entries=${this.data.length}
          @pageIndexChange=${this._onChangePage}
        ></eui-pagination-v0>
      `;
    }
    return html``;
  }

  _renderUnavalibleOnboardingNotification() {
    return html`
      <e-banner-component
        title="The onboarding service is currently unavailable or NFVO is enabled. Some actions have been
    disabled."
      ></e-banner-component>
    `;
  }

  render() {
    const { pageName, subtitle } = this;
    return html`
      <eui-layout-v0-multi-panel-tile
        tile-title=${pageName}
        subtitle=${subtitle}
        @eui-tile-panel:show=${this}
      >
        <div slot="content">
          ${!this.availability.packages && this.pageName === RESOURCES_PAGE
            ? this._renderUnavalibleOnboardingNotification()
            : null}
          ${this._renderTable()} ${this._renderPagination()}
          <p class="noDataMessage" style=${isEmpty(this.data) ? `display: block` : `display: none`}>
            ${NO_DATA_MESSAGE[pageName]}
          </p>
        </div>
        ${this._renderFilterPanel()} ${this._renderDetailsPanel()}
      </eui-layout-v0-multi-panel-tile>
    `;
  }
}

/**
 * Register the component as e-generic-multi-panel.
 * Registration can be done at a later time and with a different name
 */
GenericMultiPanel.register();
