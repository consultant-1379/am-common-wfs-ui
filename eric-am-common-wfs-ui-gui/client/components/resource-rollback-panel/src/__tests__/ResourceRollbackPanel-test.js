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
 * Integration tests for <e-resource-rollback-panel>
 */
import { assert } from "chai";
import "../ResourceRollbackPanel";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("ResourceRollbackPanel Component Tests", () => {
  let container;
  let inject;
  let resourceRollbackPanel;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceRollbackPanel = document.createElement("e-resource-rollback-panel");
    const sourceInfo = { vnfdId: 1, packageVersion: 1, packageId: 123 };
    const targetInfo = { vnfdId: 1, packageVersion: 2, packageId: 345 };
    const rollback = {};
    rollback.sourceDowngradePackageInfo = sourceInfo;
    rollback.targetDowngradePackageInfo = targetInfo;

    resourceRollbackPanel.data = { rollback };
    document.body.appendChild(resourceRollbackPanel);
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-resource-rollback-panel>", async () => {
      await inject(resourceRollbackPanel);

      const tile = inShadow(resourceRollbackPanel, "eui-layout-v0-multi-panel-tile");

      assert.isNotNull(tile, "<e-resource-rollback-panel> component failed to create");
    });
  });
});
