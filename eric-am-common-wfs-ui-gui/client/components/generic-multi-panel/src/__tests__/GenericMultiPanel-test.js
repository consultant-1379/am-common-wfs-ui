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
 * Integration tests for <e-generic-multi-panel>
 */
import { assert } from "chai";
import "../GenericMultiPanel";
import { sortCol } from "../../../../utils/CommonUtils";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericMultiPanel Component Tests", () => {
  let container;
  let inject;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-generic-multi-panel>", async () => {
      const customElement = await inject("<e-generic-multi-panel></e-generic-multi-panel>");
      customElement.pageName = "Packages";
      // check shadow DOM
      const multiPanel = inShadow(customElement, "eui-layout-v0-multi-panel-tile");
      assert.isNotNull(multiPanel, "<eui-layout-v0-multi-panel-tile> component failed to create");
      const genericTable = inShadow(customElement, "e-generic-table");
      assert.isNotNull(genericTable, "<e-generic-table> component failed to create");
    });
  });

  describe("Sorting Function as Natural Sort", () => {
    const testData = [
      { appProductName: "Package 11" },
      { appProductName: "Package 2" },
      { appProductName: "Package 1" },
      { appProductName: "Package 0" },
      { appProductName: "Not Package 3" },
      { appProductName: "Not Package 2" }
    ];
    const expectedAscTestData = [
      { appProductName: "Not Package 2" },
      { appProductName: "Not Package 3" },
      { appProductName: "Package 0" },
      { appProductName: "Package 1" },
      { appProductName: "Package 2" },
      { appProductName: "Package 11" }
    ];
    const expectedDecTestData = [
      { appProductName: "Package 11" },
      { appProductName: "Package 2" },
      { appProductName: "Package 1" },
      { appProductName: "Package 0" },
      { appProductName: "Not Package 3" },
      { appProductName: "Not Package 2" }
    ];
    const event = {
      detail: {
        column: {
          attribute: "appProductName"
        },
        sort: {}
      },
      target: {
        data: testData.slice()
      }
    };
    it("should sort selected columns ascending", async () => {
      event.detail.sort = "asc";
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedAscTestData,
        "Two objects should be the same in value"
      );
    });
    it("should sort selected columns descending", async () => {
      event.detail.sort = "dec";
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedDecTestData,
        "Two objects should be the same in value"
      );
    });
  });

  describe("Sorting Function when sorting states", () => {
    const testDataComponent = [
      { componentStateIcon: "Starting" },
      { componentStateIcon: "Rolled_back" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Failed_temp" },
      { componentStateIcon: "Rolling_back" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Failed" },
      { componentStateIcon: "Completed" }
    ];
    const expectedAscTestDataComponent = [
      { componentStateIcon: "Failed" },
      { componentStateIcon: "Failed_temp" },
      { componentStateIcon: "Rolling_back" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Starting" },
      { componentStateIcon: "Rolled_back" },
      { componentStateIcon: "Completed" }
    ];
    const expectedDecTestDataComponent = [
      { componentStateIcon: "Completed" },
      { componentStateIcon: "Rolled_back" },
      { componentStateIcon: "Starting" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Processing" },
      { componentStateIcon: "Rolling_back" },
      { componentStateIcon: "Failed_temp" },
      { componentStateIcon: "Failed" }
    ];
    const testDataPodState = [
      { componentStateIcon: "Failed" },
      { componentStateIcon: "Unknown" },
      { componentStateIcon: "Running" },
      { componentStateIcon: "Pending" },
      { componentStateIcon: "Succeeded" }
    ];
    const expectedAscTestPodState = [
      { componentStateIcon: "Failed" },
      { componentStateIcon: "Unknown" },
      { componentStateIcon: "Pending" },
      { componentStateIcon: "Running" },
      { componentStateIcon: "Succeeded" }
    ];
    const expectedDecTestPodState = [
      { componentStateIcon: "Succeeded" },
      { componentStateIcon: "Running" },
      { componentStateIcon: "Pending" },
      { componentStateIcon: "Unknown" },
      { componentStateIcon: "Failed" }
    ];
    const event = {
      detail: {
        column: {
          attribute: {},
          isColState: true
        },
        sort: {}
      },
      target: {
        data: {}
      }
    };
    it("should sort selected columns ascending for component state values", async () => {
      event.detail.sort = "asc";
      event.detail.column.attribute = "componentStateIcon";
      event.target.data = testDataComponent;
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedAscTestDataComponent,
        "Two objects should be the same in value"
      );
    });
    it("should sort selected columns descending for component state values", async () => {
      event.detail.sort = "dec";
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedDecTestDataComponent,
        "Two objects should be the same in value"
      );
    });
    it("should sort selected columns ascending for pod state values", async () => {
      event.detail.sort = "asc";
      event.detail.column.attribute = "componentStateIcon";
      event.target.data = testDataPodState;
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedAscTestPodState,
        "Two objects should be the same in value"
      );
    });
    it("should sort selected columns descending for pod state values", async () => {
      event.detail.sort = "dec";
      sortCol(event);
      assert.deepEqual(
        event.target.data,
        expectedDecTestPodState,
        "Two objects should be the same in value"
      );
    });
  });
});
