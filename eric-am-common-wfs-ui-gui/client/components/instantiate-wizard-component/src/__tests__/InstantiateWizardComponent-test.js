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
 * Integration tests for <e-instantiate-wizard-component>
 */
import { expect } from "chai";
import "../InstantiateWizardComponent";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { checkPermission } from "../../../../utils/CommonUtils";
import { INSTANTIATE_RESOURCE_NAME } from "../../../../constants/GenericConstants";

describe("InstantiateWizardComponent Component Tests", () => {
  let container;
  let inject;
  let instantiateWizardComponent;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    instantiateWizardComponent = document.createElement("e-instantiate-wizard-component");
    instantiateWizardComponent.isValidPermission = checkPermission(
      superUserPermissions().userInformation,
      INSTANTIATE_RESOURCE_NAME
    );
    document.body.appendChild(instantiateWizardComponent);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-instantiate-wizard-component>", async () => {
      await inject(instantiateWizardComponent);
      // check shadow DOM
      const headingTag = inShadow(instantiateWizardComponent, "eui-layout-v0-wizard-step");
      expect(headingTag, "Test failed").to.have.a.property("stepTitle", "Package selection");
    });
  });
});
