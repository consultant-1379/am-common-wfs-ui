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
import { definition } from "@eui/component";
import { LitComponent, html } from "@eui/lit-component";
import style from "./operationsHistoryList.css";

/**
 * @property {boolean} data - the data to be rendered.
 */
@definition("e-operations-history-list", {
  style,
  home: "operations-history-list",
  props: {
    data: { attribute: true, type: "array", default: [] }
  }
})
export default class OperationsHistoryList extends LitComponent {
  _renderListData() {
    return this.data.map(
      row => html`
        <li>
          <div class="timestamp">${row.stateEnteredTime}</div>
          <div class="state">${row.lifecycleOperationType} - ${row.operationState}</div>
        </li>
      `
    );
  }

  render() {
    return html`
      <div class="timeline">
        <ul>
          ${this._renderListData()}
        </ul>
      </div>
    `;
  }
}

/**
 * Register the component as e-operations-history-list.
 * Registration can be done at a later time and with a different name
 */
OperationsHistoryList.register();
