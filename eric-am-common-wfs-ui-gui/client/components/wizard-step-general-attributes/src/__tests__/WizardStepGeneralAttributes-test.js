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
 * Integration tests for <e-wizard-step-general-attributes>
 */
import { assert } from "chai";
import "../WizardStepGeneralAttributes";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("WizardStepGeneralAttributes Component Tests", () => {
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
    it("should create a new <e-wizard-step-general-attributes>", async () => {
      const customElement = await inject(
        "<e-wizard-step-general-attributes></e-wizard-step-general-attributes>"
      );
      // check shadow DOM
      const infrastructure = inShadow(customElement, ".infrastructure");
      assert.isNotNull(infrastructure, "Infrastructure content failed to create");

      const generalAttributes = inShadow(customElement, ".generalAttrs");
      assert.isNotNull(generalAttributes, "General Attributes content failed to create");
    });
  });
});
