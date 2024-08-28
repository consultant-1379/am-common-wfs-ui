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
 * Integration tests for <e-generic-text-area>
 */
import { assert } from "chai";
import "../GenericTextArea";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericTextArea Component Tests", () => {
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
    it("should create a new <e-generic-text-area>", async () => {
      const customElement = await inject("<e-generic-text-area></e-generic-text-area>");
      // check shadow DOM
      const textArea = inShadow(customElement, "eui-base-v0-textarea");
      assert.isNotNull(textArea, "eui-base-v0-textarea component failed to create");
    });
  });

  describe("Test getValue function in e-generic-text-area", () => {
    it("should get the value in eui-base-v0-text-field", async () => {
      const customElement = await inject(
        '<e-generic-text-area id="123" placeholder="Description" value="100"></e-generic-text-area>'
      );
      assert.equal(customElement.getValue(), "100", "getValue() in text field is not working");
    });
  });

  describe("Test reset function in e-generic-text-area", () => {
    it("should get the value in eui-base-v0-text-field", async () => {
      const customElement = await inject(
        '<e-generic-text-area id="123" placeholder="Description" value="100"></e-generic-text-area>'
      );
      assert.equal(customElement.reset(), undefined, "reset() in text field is not working");
    });
  });
});
