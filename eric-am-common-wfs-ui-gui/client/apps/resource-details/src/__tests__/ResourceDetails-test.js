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
 * Integration tests for <e-resource-details>
 */
import { assert } from "chai";
import ResourceDetails from "../ResourceDetails";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("ResourceDetails Application Tests", () => {
  let container;
  let inject;
  let resourceDetails;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceDetails = document.createElement("e-resource-details");
    resourceDetails.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(resourceDetails);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    ResourceDetails.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-resource-details>", async () => {
      await inject(resourceDetails);
      // check shadow DOM
      const detailsComponent = inShadow(resourceDetails, "e-resource-details-panel");
      assert.isNotNull(detailsComponent, "<e-resource-details-panel> component failed to create");
    });
  });
});
