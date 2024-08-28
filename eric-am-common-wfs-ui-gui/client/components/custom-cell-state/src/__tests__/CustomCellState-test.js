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
 * Integration tests for <e-custom-cell-state>
 */
import { assert } from "chai";
import "../CustomCellState";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("CustomCellState Component Tests", () => {
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
    it("should create a new <e-custom-cell-state>", async () => {
      const customElement = await inject(
        '<e-custom-cell-state cell-value="completed"></e-custom-cell-state>'
      );
      // check shadow DOM
      const iconElement = inShadow(customElement, "eui-v0-icon");
      assert.isNotNull(iconElement, "<eui-v0-icon> component failed to create");
    });
  });
});
