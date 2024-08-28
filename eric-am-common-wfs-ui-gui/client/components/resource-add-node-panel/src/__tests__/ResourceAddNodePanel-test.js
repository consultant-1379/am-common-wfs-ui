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
 * Integration tests for <e-resource-add-node-panel>
 */
import { assert, expect } from "chai";
import "../ResourceAddNodePanel";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { checkPermission } from "../../../../utils/CommonUtils";
import { ADD_NODE_RESOURCE_NAME } from "../../../../constants/GenericConstants";

describe("ResourceAddNodePanel Component Tests", () => {
  let container;
  let inject;
  let resourceAddNodePanel;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceAddNodePanel = document.createElement("e-resource-add-node-panel");
    resourceAddNodePanel.isValidPermission = checkPermission(
      superUserPermissions().userInformation,
      ADD_NODE_RESOURCE_NAME
    );
    document.body.appendChild(resourceAddNodePanel);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-resource-add-node-panel>", async () => {
      await inject(resourceAddNodePanel);
      const textField = inShadow(resourceAddNodePanel, "eui-base-v0-text-field");
      assert.isNotNull(textField);
      expect(textField, "Test failed").to.have.a.property("placeholder");
    });
  });
});
