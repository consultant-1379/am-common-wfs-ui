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
 * Integration tests for <e-instantiate-wizard>
 */
import { expect } from "chai";
import InstantiateWizard from "../InstantiateWizard";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("InstantiateWizard Application Tests", () => {
  let container;
  let inject;
  let instantiateWizard;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    instantiateWizard = document.createElement("e-instantiate-wizard");
    instantiateWizard.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };

    document.body.appendChild(instantiateWizard);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    InstantiateWizard.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-instantiate-wizard>", async () => {
      await inject(instantiateWizard);
      // check shadow DOM
      const component = inShadow(instantiateWizard, "e-instantiate-wizard-component");
      const step = inShadow(component, "eui-layout-v0-wizard-step");
      expect(step, "Test failed").to.have.a.property("stepTitle", "Package selection");
    });
  });
});
