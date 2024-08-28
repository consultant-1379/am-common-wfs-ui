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

/* eslint import/no-duplicates: 0 */

/**
 * Integration tests for <e-wizard-step-additional-attributes>
 */
import { assert, expect } from "chai";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import {
  filterAdditionalAttributesByRequired,
  mapAdditionalAttributesByChartParam
} from "../WizardStepAdditionalAttributes.js";

import "../WizardStepAdditionalAttributes";

// helpers
import { ADDITIONAL_ATTRIBUTES_BLACK_LIST } from "../../../../utils/CommonUtils";

// mocks
import additionalAttribute from "./additional-attributes.json";
import additionalAttributeWithGA from "./additional-attributes-with-ga.json";

describe("WizardStepAdditionalAttributes Component Tests", () => {
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
    it("should create a new <e-wizard-step-additional-attributes>", async () => {
      const customElement = await inject(
        "<e-wizard-step-additional-attributes></e-wizard-step-additional-attributes>"
      );
      const element = inShadow(customElement, ".td.paddingInputTd");
      assert.isNotNull(
        element,
        "'Additional attribute content with class .td.paddingInputTd' was not found"
      );
    });
  });
});

describe("WizardStepAdditionalAttributes unit tests", () => {
  const mockData = additionalAttribute;
  const mockDataWithGA = additionalAttributeWithGA;

  describe("Validation required fields on additional attributes", () => {
    it("should filter not required fields", async () => {
      const getGeneralFilteredAttributes = ADDITIONAL_ATTRIBUTES_BLACK_LIST.Instantiate;
      const filteredData = mockData.filter(filterAdditionalAttributesByRequired, {
        getGeneralFilteredAttributes
      });

      assert.typeOf(filteredData, "array");
      expect(filteredData.length).to.equal(1);
    });

    it("should ignore fields from general attribute", async () => {
      const getGeneralFilteredAttributes = ADDITIONAL_ATTRIBUTES_BLACK_LIST.Instantiate;
      const filteredData = mockDataWithGA.filter(filterAdditionalAttributesByRequired, {
        getGeneralFilteredAttributes
      });

      assert.typeOf(filteredData, "array");
      expect(filteredData.length).to.equal(1);
    });

    it("should map fields to array of keys", async () => {
      const parsedData = mockData.map(mapAdditionalAttributesByChartParam);

      assert.typeOf(parsedData, "array");
      expect(parsedData.length).to.equal(2);

      assert.typeOf(parsedData[0], "string");
      expect(parsedData[0]).to.equal(mockData[0].metadata.chart_param);
    });

    it("should parse additional attributes data to list of required fileds", async () => {
      const getGeneralFilteredAttributes = ADDITIONAL_ATTRIBUTES_BLACK_LIST.Instantiate;
      const filteredAndParsedData = mockData
        .filter(filterAdditionalAttributesByRequired, { getGeneralFilteredAttributes })
        .map(mapAdditionalAttributesByChartParam);

      assert.typeOf(filteredAndParsedData, "array");
      expect(filteredAndParsedData.length).to.equal(1);

      assert.typeOf(filteredAndParsedData[0], "string");
      expect(filteredAndParsedData[0]).to.equal(mockData[0].metadata.chart_param);
    });

    it("should parse additional attributes data to list of required fileds and skip params from general attributes", async () => {
      const getGeneralFilteredAttributes = ADDITIONAL_ATTRIBUTES_BLACK_LIST.Instantiate;
      const filteredAndParsedData = mockDataWithGA
        .filter(filterAdditionalAttributesByRequired, { getGeneralFilteredAttributes })
        .map(mapAdditionalAttributesByChartParam);

      assert.typeOf(filteredAndParsedData, "array");
      expect(filteredAndParsedData.length).to.equal(1);

      assert.typeOf(filteredAndParsedData[0], "string");
      expect(filteredAndParsedData[0]).to.equal(mockData[0].metadata.chart_param);
    });
  });
});
