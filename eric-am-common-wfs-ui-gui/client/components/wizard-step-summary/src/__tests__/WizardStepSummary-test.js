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
 * Integration tests for <e-wizard-step-summary>
 */
import { expect, assert } from "chai";
import "../WizardStepSummary";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("WizardStepSummary Component Tests", () => {
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
    it("should create a new <e-wizard-step-summary> that contains an accordion for additional attributes", async () => {
      const stepElement = await inject("<e-wizard-step-summary></e-wizard-step-summary>");
      // check shadow DOM
      const summaryTitle = inShadow(stepElement, ".summary-title");
      expect(
        summaryTitle.textContent.replace(/\s+/g, " ").trim(),
        "summary title text was incorrect or not found"
      ).to.equal("You are about to instantiate a resource with the following attributes:");

      const resourceInstanceNameKey = inShadow(
        stepElement,
        ".summary-key-value-list-item>.summary-key"
      );
      expect(
        resourceInstanceNameKey.textContent,
        "resource instance name key text was incorrect or not found"
      ).to.contain("Resource instance name");

      const resourceInstanceNameValue = inShadow(
        stepElement,
        ".summary-key-value-list-item .summary-value e-custom-cell"
      );
      assert.isNotNull(
        resourceInstanceNameValue,
        "additional attributes key value list failed to create"
      );
      const additionalAttributesAccordion = inShadow(stepElement, "e-generic-accordion");

      const additionalAttributesAccordionTitle = inShadow(
        additionalAttributesAccordion,
        ".accordion-title"
      );
      expect(
        additionalAttributesAccordionTitle.innerText.trim(),
        "accordion title incorrect or not found"
      ).to.equal("Additional attributes");

      const additionalAttributesKeyValueList = inShadow(
        stepElement,
        "e-generic-accordion .summary-key-value-list"
      );
      assert.isNotNull(
        additionalAttributesKeyValueList,
        "additional attributes key value list failed to create"
      );
    });
  });
});
