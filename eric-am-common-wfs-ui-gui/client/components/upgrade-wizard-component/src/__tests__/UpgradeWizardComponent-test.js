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
 * Integration tests for <e-upgrade-wizard-component>
 */
import { expect, assert } from "chai";
import "../UpgradeWizardComponent";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { UPGRADE_RESOURCE_NAME } from "../../../../constants/GenericConstants";
import { checkPermission } from "../../../../utils/CommonUtils";

describe("UpgradeWizardComponent Component Tests", () => {
  let container;
  let inject;
  let UpgradeWizardComponent;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    UpgradeWizardComponent = document.createElement("e-instantiate-wizard-component");
    UpgradeWizardComponent.isValidPermission = checkPermission(
      superUserPermissions().userInformation,
      UPGRADE_RESOURCE_NAME
    );
    document.body.appendChild(UpgradeWizardComponent);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-upgrade-wizard-component>", async () => {
      await inject(UpgradeWizardComponent);
      const headingTag = inShadow(UpgradeWizardComponent, "eui-layout-v0-wizard-step");
      assert.isNotNull(headingTag);
      expect(headingTag, "Test failed").to.have.a.property("stepTitle", "Package selection");
    });
  });
});
