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
 * Integration tests for <e-resource-details-panel>
 */
import { assert } from "chai";
import "../ResourceDetailsPanel";
import { filterData } from "../../../../utils/CommonUtils";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("ResourceDetailsPanel Component Tests", () => {
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
    it("should create a new <e-resource-details-panel>", async () => {
      const customElement = await inject("<e-resource-details-panel></e-resource-details-panel>");
      // check shadow DOM
      const paragraphComponent = inShadow(customElement, "p");
      assert.isNotNull(paragraphComponent, "<e-resource-details-panel> component failed to create");
    });
  });

  describe("Filter functionality", () => {
    it("should filter the array based on the filterText", async () => {
      const event = {
        currentTarget: {
          value: "livenessProbe"
        }
      };

      const testData = [
        {
          parameter: "livenessProbe.timeoutSeconds",
          value: "10"
        },
        {
          parameter: "livenessProbe.periodSeconds",
          value: "20"
        },
        { parameter: "readinessProbe.initialDelaySeconds", value: "50" },
        { parameter: "readinessProbe.timeoutSeconds", value: "15" }
      ];

      const expectedData = [
        {
          parameter: "livenessProbe.timeoutSeconds",
          value: "10"
        },
        {
          parameter: "livenessProbe.periodSeconds",
          value: "20"
        }
      ];
      const filteredData = filterData(event.currentTarget.value, testData);
      assert.deepEqual(filteredData, expectedData, "Filtering logic failed");
    });

    it("should filter the array based on the filterText for only specific columns", async () => {
      const event = {
        currentTarget: {
          value: "livenessProbe"
        }
      };

      const testData = [
        {
          parameter: "livenessProbe.timeoutSeconds",
          value: "10"
        },
        {
          parameter: "readinessProbe.initialDelaySeconds",
          value: "20",
          newParameter: "livenessProbe.periodSeconds"
        },
        { parameter: "readinessProbe.initialDelaySeconds", value: "50" },
        { parameter: "readinessProbe.timeoutSeconds", value: "15" }
      ];

      const columnAttributes = ["parameter", "value"];

      const expectedData = [
        {
          parameter: "livenessProbe.timeoutSeconds",
          value: "10"
        }
      ];
      const filteredData = filterData(event.currentTarget.value, testData, columnAttributes);
      assert.deepEqual(filteredData, expectedData, "Filtering logic failed");
    });
  });
});
