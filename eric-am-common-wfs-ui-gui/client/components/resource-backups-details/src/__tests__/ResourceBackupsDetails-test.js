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
 * Integration tests for <e-resource-backups-details>
 */
import { assert } from "chai";
import "../ResourceBackupsDetails";
import { injectHTMLElement, inShadow } from "../../../../../test/utils";

describe("ResourceBackupsDetails Component Tests", () => {
  let container;
  let inject;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup", () => {
    it("should create a new <e-resource-backups-details>", async () => {
      const customElement = await inject(
        "<e-resource-backups-details></e-resource-backups-details>"
      );
      // check shadow DOM
      const backupsTable = inShadow(customElement, "e-generic-table");
      assert.isNotNull(backupsTable, "No backups table has been rendered");
    });
  });
});
