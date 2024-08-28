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
 * Integration tests for <e-additional-attributes-tab>
 */
import { assert } from "chai";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("AdditionalAttributesTab Component Tests", () => {
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
    it("should create a new <e-additional-attributes-tab>", async () => {
      const appTest = await inject("<e-additional-attributes-tab></e-additional-attributes-tab>");
      // check shadow DOM
      const addAttComp = inShadow(appTest, ".additionalAttributesTab");
      assert.isNotNull(addAttComp, "<e-additional-attributes-tab> component failed to create.");
    });
  });
});
