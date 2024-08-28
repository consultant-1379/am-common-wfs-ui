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
 * Integration tests for <e-generic-text-field>
 */
import { assert } from "chai";
import "../GenericTextField";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericTextField Component Tests", () => {
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
    it("should create a new <e-generic-text-field>", async () => {
      const customElement = await inject("<e-generic-text-field></e-generic-text-field>");
      // check shadow DOM
      const textFieldElement = inShadow(customElement, "eui-base-v0-text-field");
      assert.isNotNull(textFieldElement, "<eui-base-v0-text-field> component failed to create");
    });
  });

  describe("Test getValue function in e-generic-text-field", () => {
    it("should get the value in eui-base-v0-text-field", async () => {
      const customElement = await inject(
        '<e-generic-text-field id="123" placeholder="Description" value="100"></e-generic-text-field>'
      );
      assert.equal(customElement.getValue(), "100", "getValue() in text field is not working");
    });
  });

  describe("Test reset function in e-generic-text-field", () => {
    it("should get the value in eui-base-v0-text-field", async () => {
      const customElement = await inject(
        '<e-generic-text-field id="123" placeholder="Description" value="100"></e-generic-text-field>'
      );
      assert.equal(customElement.reset(), undefined, "reset() in text field is not working");
    });
  });
});
