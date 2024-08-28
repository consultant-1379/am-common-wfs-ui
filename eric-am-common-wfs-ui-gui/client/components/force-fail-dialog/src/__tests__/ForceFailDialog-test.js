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
 * Integration tests for <e-force-fail-dialog>
 */
import { assert } from "chai";
import "../ForceFailDialog";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("ForceFailDialog Component Tests", () => {
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
    it("should create a new <e-force-fail-dialog>", async () => {
      const customElement = await inject("<e-force-fail-dialog></e-force-fail-dialog>");
      // check shadow DOM
      const dialog = allInShadow(customElement, "eui-base-v0-dialog");
      assert.isNotNull(dialog, "<eui-base-v0-dialog> Dialog failed to create");
    });
  });
});
