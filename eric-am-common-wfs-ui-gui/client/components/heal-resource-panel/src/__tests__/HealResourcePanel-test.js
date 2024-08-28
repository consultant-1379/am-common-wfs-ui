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
 * Integration tests for <e-heal-resource-panel>
 */
import { assert } from "chai";
import "../HealResourcePanel";
import { injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { checkPermission } from "../../../../utils/CommonUtils";
import { HEAL_RESOURCE_NAME } from "../../../../constants/GenericConstants";

describe("HealResourcePanel Component Tests", () => {
  let container;
  let inject;
  let healResourcePanel;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    healResourcePanel = document.createElement("e-heal-resource-panel");
    healResourcePanel.isValidPermission = checkPermission(
      superUserPermissions().userInformation,
      HEAL_RESOURCE_NAME
    );
    document.body.appendChild(healResourcePanel);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-heal-resource-panel>", async () => {
      const customElement = await inject(healResourcePanel);
      assert.isNotNull(customElement);
    });
  });
});
