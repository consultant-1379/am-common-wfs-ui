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
 * Integration tests for <e-scale-resource-panel>
 */
import { assert } from "chai";
import "../ScaleResourcePanel";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { checkPermission } from "../../../../utils/CommonUtils";
import { SCALE_RESOURCE_NAME } from "../../../../constants/GenericConstants";

describe("ScaleResourcePanel Component Tests", () => {
  let container;
  let inject;
  let scaleResourcePanel;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    scaleResourcePanel = document.createElement("e-scale-resource-panel");
    scaleResourcePanel.isValidPermission = checkPermission(
      superUserPermissions().userInformation,
      SCALE_RESOURCE_NAME
    );
    document.body.appendChild(scaleResourcePanel);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-scale-resource-panel>", async () => {
      const customElement = await inject(scaleResourcePanel);
      assert.isNotNull(customElement);
    });
  });

  describe("Should check radio component", () => {
    it("should contain <eui-base-v0-radio-button> component", async () => {
      const customElement = await inject("<e-scale-resource-panel></e-scale-resource-panel>");
      assert.isNotNull(customElement);
      const dropdown = allInShadow(customElement, "eui-base-v0-radio-button");
      assert.isNotNull(dropdown, "<eui-base-v0-radio-button> component failed to create");
    });
  });

  describe("Should check button component", () => {
    it("should contain <eui-base-v0-button> component", async () => {
      const customElement = await inject("<e-scale-resource-panel></e-scale-resource-panel>");
      assert.isNotNull(customElement);
      const dropdown = allInShadow(customElement, "eui-base-v0-button");
      assert.isNotNull(dropdown, "<eui-base-v0-button> component failed to create");
    });
  });

  describe("Should check textfield component", () => {
    it("should contain <e-generic-text-field> component", async () => {
      const customElement = await inject("<e-scale-resource-panel></e-scale-resource-panel>");
      assert.isNotNull(customElement);
      const dropdown = allInShadow(customElement, "e-generic-text-field");
      assert.isNotNull(dropdown, "<e-generic-text-field> component failed to create");
    });
  });
});
