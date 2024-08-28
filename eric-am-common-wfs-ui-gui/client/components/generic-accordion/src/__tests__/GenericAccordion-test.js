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
 * Integration tests for <e-generic-accordion>
 */
import { expect, assert } from "chai";
import "../GenericAccordion";
import { injectHTMLElement, inShadow } from "../../../../../test/utils";

describe("GenericAccordion Component Tests", () => {
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
    it("should create a new <e-generic-accordion>", async () => {
      const component = await inject("<e-generic-accordion></e-generic-accordion>");
      expect(component).to.have.property("accordionTitle", "Accordion");
      const chevron = inShadow(component, "eui-base-v0-icon");
      assert.isNotNull(chevron, "<e-generic-accordion> component failed to create.");
    });
  });
});
