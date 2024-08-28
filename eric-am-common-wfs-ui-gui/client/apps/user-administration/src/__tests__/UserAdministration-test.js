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
 * Integration tests for <e-user-administration>
 */
import { assert } from "chai";
import UserAdministration from "../UserAdministration";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";

describe("UserAdministration Application Tests", () => {
  let container;
  let inject;
  let userManagementApp;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    userManagementApp = document.createElement("e-user-administration");
    userManagementApp.storeConnect = () => {
      return superUserPermissions();
    };
    document.body.appendChild(userManagementApp);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    UserAdministration.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-user-administration>", async () => {
      await inject(userManagementApp);
      // check shadow DOM
      const element = inShadow(userManagementApp, "div");
      assert.isNotNull(element, "<e-user-administration> component failed to create");
    });
  });
});
