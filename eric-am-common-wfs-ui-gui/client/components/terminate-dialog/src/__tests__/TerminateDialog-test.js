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
 * Integration tests for <e-terminate-dialog>
 */
import { assert } from "chai";
import "../TerminateDialog";
import { injectHTMLElement, allInShadow } from "../../../../../test/utils";

describe("TerminateDialog Component Tests", () => {
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
    it("should create a new <e-terminate-dialog>", async () => {
      const customElement = await inject("<e-terminate-dialog></e-terminate-dialog>");
      // check shadow DOM
      const dialog = allInShadow(customElement, "eui-base-v0-dialog");
      assert.isNotNull(dialog, "<eui-base-v0-dialog> Dialog failed to create");
    });
  });
});
