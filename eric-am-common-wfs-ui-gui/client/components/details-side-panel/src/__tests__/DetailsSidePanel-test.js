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
 * Integration tests for <e-details-side-panel>
 */
import { assert } from "chai";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("DetailsSidePanel Component Tests", () => {
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
    it("should create a new <e-details-side-panel>", async () => {
      const detailsSidePanelComponent = await inject(
        "<e-details-side-panel></e-details-side-panel>"
      );
      // check shadow DOM
      const paragraphComponent = inShadow(detailsSidePanelComponent, "p");
      assert.isNotNull(paragraphComponent, "<e-details-side-panel> component failed to create");
    });
  });
});
