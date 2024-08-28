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
 * Integration tests for <e-resources>
 */
import { assert } from "chai";
import Resources from "../Resources";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("Resources Application Tests", () => {
  let container;
  let inject;
  let resources;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resources = document.createElement("e-resources");
    resources.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(resources);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    Resources.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-generic-multi-panel> ", async () => {
      await inject(resources);
      // check shadow DOM
      const resourceTableComponent = inShadow(resources, "e-generic-multi-panel");
      assert.isNotNull(
        resourceTableComponent,
        "<e-generic-multi-panel> component failed to create"
      );
    });
  });
});
