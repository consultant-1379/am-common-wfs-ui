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
 * Integration tests for <e-custom-cell>
 */
import { assert } from "chai";
import "../CustomCell";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("CustomCell Component Tests", () => {
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
    it("should create a new <e-custom-cell>", async () => {
      const customElement = await inject("<e-custom-cell></e-custom-cell>");
      // check shadow DOM
      const customCellComponent = inShadow(customElement, "e-context-menu");
      assert.isNotNull(customCellComponent, "<e-context-menu> component failed to create");
    });
  });
});
