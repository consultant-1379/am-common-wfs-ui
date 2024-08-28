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
import { expect } from "chai";
import "../GenericKeyMapCardGroup";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericKeyMapCardGroup Component Tests", () => {
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
    it("should create a new <e-generic-key-map-card-group>", async () => {
      const keyMapCardGroup = await inject(
        "<e-generic-key-map-card-group></e-generic-key-map-card-group>"
      );
      // check shadow DOM
      const addCardButton = inShadow(keyMapCardGroup, "eui-base-v0-button");
      expect(addCardButton, "addCardButton was not found").to.not.equal(null);
    });
  });
});
