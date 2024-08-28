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
 * Integration tests for <e-wizard-step-package-selection>
 */
import { assert } from "chai";
import "../WizardStepPackageSelection";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("WizardStepPackageSelection Component Tests", () => {
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
    it("should create a new <e-wizard-step-package-selection>", async () => {
      const customElement = await inject(
        "<e-wizard-step-package-selection></e-wizard-step-package-selection>"
      );
      // check shadow DOM
      const genericMultiPanel = inShadow(customElement, "e-generic-multi-panel");
      assert.isNotNull(genericMultiPanel, "Package Selection Step content failed to create");
    });
  });
});
