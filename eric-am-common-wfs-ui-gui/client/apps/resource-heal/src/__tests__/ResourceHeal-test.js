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
 * Integration tests for <e-resource-heal>
 */
import { assert } from "chai";
import ResourceHeal from "../ResourceHeal";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("ResourceHeal Application Tests", () => {
  let container;
  let inject;
  let resourceHeal;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceHeal = document.createElement("e-resource-heal");
    resourceHeal.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(resourceHeal);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    ResourceHeal.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-resource-heal>", async () => {
      await inject(resourceHeal);
      const resourceHealComponent = inShadow(resourceHeal, "e-heal-resource-panel");
      assert.isNotNull(resourceHealComponent, "<e-heal-resource-panel> component failed to create");
    });
  });
});
