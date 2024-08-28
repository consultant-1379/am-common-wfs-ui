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
 * Integration tests for <e-generic-key-map-card>
 */
import { assert } from "chai";
import "../GenericKeyMapCard";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericKeyMapCard Component Tests", () => {
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
    it("should create a new <e-generic-key-map-card>", async () => {
      const customElement = await inject("<e-generic-key-map-card></e-generic-key-map-card>");
      // check shadow DOM
      const cardClass = inShadow(customElement, ".generic-ui-card");
      assert.isNotNull(cardClass, "generic card does not contain parent div");
    });
  });
});
