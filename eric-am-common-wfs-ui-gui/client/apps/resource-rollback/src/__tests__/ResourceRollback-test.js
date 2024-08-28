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
 * Integration tests for <e-resource-rollback>
 */
import { assert } from "chai";
import ResourceRollback from "../ResourceRollback";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("ResourceRollback Application Tests", () => {
  let container;
  let inject;
  let resourceRollback;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceRollback = document.createElement("e-resource-rollback");
    resourceRollback.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(resourceRollback);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    ResourceRollback.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-resource-rollback>", async () => {
      await inject(resourceRollback);

      const rollbackPanel = inShadow(resourceRollback, "e-resource-rollback-panel");
      assert.isNotNull(rollbackPanel, "<e-resource-rollback-panel> component failed to create");
    });
  });
});
