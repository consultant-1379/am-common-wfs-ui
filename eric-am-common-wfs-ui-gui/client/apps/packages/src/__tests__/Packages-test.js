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
 * Integration tests for <e-packages>
 */
import { assert } from "chai";
import Packages from "../Packages";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("Packages Application Tests", () => {
  let container;
  let inject;
  let packages;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    packages = document.createElement("e-packages");
    packages.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(packages);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    Packages.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-generic-multi-panel> component", async () => {
      await inject(packages);
      // check shadow DOM
      const packageTableComponent = inShadow(packages, "e-generic-multi-panel");
      assert.isNotNull(packageTableComponent, "<e-generic-multi-panel> component failed to create");
    });
  });
});
