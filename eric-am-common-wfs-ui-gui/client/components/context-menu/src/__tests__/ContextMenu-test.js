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
 * Integration tests for <e-context-menu>
 */
import { assert } from "chai";
import "../ContextMenu";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("ContextMenu Component Tests", () => {
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
    it("should create a new <e-context-menu>", async () => {
      const customElement = await inject("<e-context-menu></e-context-menu>");
      // check shadow DOM
      const conextMenuComponent = inShadow(customElement, "eui-base-v0-dropdown");
      assert.isNotNull(conextMenuComponent, "<eui-base-v0-dropdown> component failed to create");
    });
  });
});
