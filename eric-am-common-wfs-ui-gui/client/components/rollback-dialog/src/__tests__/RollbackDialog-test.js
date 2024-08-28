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
 * Integration tests for <e-clean-up-dialog>
 */
import { assert } from "chai";
import RollbackDialog from "../RollbackDialog";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("RollbackDialog Component Tests", () => {
  let container;
  let inject;
  let rollbackDialog;
  before(() => {
    rollbackDialog = document.createElement("e-rollback-dialog");

    const data = {};
    data.downgradePackageInfo = {};
    data.downgradePackageInfo.sourceDowngradePackageInfo = {};
    data.downgradePackageInfo.sourceDowngradePackageInfo.packageVersion = "sourceVersion";
    data.downgradePackageInfo.targetDowngradePackageInfo = {};
    data.downgradePackageInfo.targetDowngradePackageInfo.packageVersion = "targetVersion";
    rollbackDialog.data = data;
    document.body.appendChild(rollbackDialog);

    container = document.body.appendChild(document.createElement("div"));
    inject = injectHTMLElement.bind(null, container);

    RollbackDialog.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-rollback-dialog>", async () => {
      await inject(rollbackDialog);
      // check shadow DOM
      const dialog = allInShadow(rollbackDialog, "eui-base-v0-dialog");
      assert.isNotNull(dialog, "<eui-base-v0-dialog> Dialog failed to create");
    });
  });
});
