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
import "../GenericKeyValuePairInputGroup";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericKeyValuePairInputGroup Component Tests", () => {
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
    it("should create a new <e-generic-key-value-pair-input-group>", async () => {
      const customElement = await inject(
        "<e-generic-key-value-pair-input-group></e-generic-key-value-pair-input-group>"
      );
      const keyValuePairTitle = inShadow(customElement, ".keyValuePairTitle");
      const keyValuePairGroup = inShadow(customElement, ".keyValuePairGroup");
      const addKeyValuePairBtn = inShadow(customElement, "#addKeyValuePairBtn");
      expect(keyValuePairTitle, "keyValuePairTitle was not found").to.not.equal(null);
      expect(keyValuePairGroup, "keyValuePairGroup was not found").to.not.equal(null);
      expect(addKeyValuePairBtn, "addKeyValuePairBtn was not found").to.not.equal(null);
    });
  });
});
