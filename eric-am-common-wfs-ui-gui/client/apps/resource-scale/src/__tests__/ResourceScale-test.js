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
 * Integration tests for <e-resource-scale>
 */
import { assert } from "chai";
import ResourceScale from "../ResourceScale";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("ResourceScale Application Tests", () => {
  let container;
  let inject;
  let resourceScale;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceScale = document.createElement("e-resource-scale");
    resourceScale.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(resourceScale);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    ResourceScale.register();
  });

  after(() => {
    document.body.removeChild(container);
  });
  describe("Basic application setup", () => {
    it("should create a new <e-resource-scale>", async () => {
      await inject(resourceScale);
      const resourceScaleComponent = inShadow(resourceScale, "e-scale-resource-panel");
      assert.isNotNull(
        resourceScaleComponent,
        "<e-scale-resource-panel> component failed to create"
      );
    });
  });
});
