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
 * Integration tests for <e-documentation>
 */
import { assert } from "chai";
import Documentation from "../Documentation";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("Documentation Application Tests", () => {
  let container;
  let inject;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    Documentation.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-documentation>", async () => {
      const appUnderTest = await inject("<e-documentation></e-documentation>");
      // check shadow DOM
      const div = inShadow(appUnderTest, "div");
      assert.isNotNull(div, "<e-documentation> component failed to create");
    });
  });
});
