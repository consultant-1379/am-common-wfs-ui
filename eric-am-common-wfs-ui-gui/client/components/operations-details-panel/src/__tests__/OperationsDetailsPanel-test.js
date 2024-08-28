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
 * Integration tests for <e-operations-details-panel>
 */
import { expect } from "chai";
import "../OperationsDetailsPanel";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("OperationsDetailsPanel Component Tests", () => {
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
    it("should create a new <e-operations-details-panel>", async () => {
      const customElement = await inject(
        "<e-operations-details-panel></e-operations-details-panel>"
      );
      // check shadow DOM
      const paragraphTag = inShadow(customElement, "p");
      expect(paragraphTag.textContent, '"No operation selected" was not found').to.equal(
        "No operation selected"
      );
    });
  });
});
