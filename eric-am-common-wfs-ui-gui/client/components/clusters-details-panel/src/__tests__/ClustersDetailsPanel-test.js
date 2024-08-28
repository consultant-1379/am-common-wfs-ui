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
 * Integration tests for <e-clusters-details-panel>
 */
import { expect } from "chai";
import "../ClustersDetailsPanel";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("ClustersDetailsPanel Component Tests", () => {
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
    it("should create a new <e-clusters-details-panel>", async () => {
      const customElement = await inject("<e-clusters-details-panel></e-clusters-details-panel>");
      // check shadow DOM
      const paragraphTag = inShadow(customElement, "p");
      expect(paragraphTag.textContent, '"No cluster selected" was not found').to.equal(
        "No cluster selected"
      );
    });
  });
});
