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
 * Integration tests for <e-package-details>
 */
import { assert } from "chai";
import PackageDetails from "../PackageDetails";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";

describe("PackageDetails Application Tests", () => {
  let container;
  let inject;
  let packageDetails;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    packageDetails = document.createElement("e-package-details");
    packageDetails.storeConnect = () => {
      return superUserPermissions();
    };
    document.body.appendChild(packageDetails);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    PackageDetails.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-package-details>", async () => {
      await inject(packageDetails);
      // check shadow DOM
      const detailsComponent = inShadow(packageDetails, "e-details-side-panel");
      assert.isNotNull(detailsComponent, "<e-details-side-panel> component failed to create");
    });
  });
});
