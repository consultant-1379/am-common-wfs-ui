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
import "../GenericKeyValuePairInput";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericKeyValuePairInput Component Tests", () => {
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
    it("should create a new <e-generic-key-value-input>", async () => {
      const keyValueInput = await inject(
        "<e-generic-key-value-pair-input></e-generic-key-value-pair-input>"
      );
      // check shadow DOM
      const keyTextField = inShadow(keyValueInput, "e-generic-text-field");
      const valueFileTextField = inShadow(keyValueInput, "e-generic-key-value-file-text-input");
      const deleteIcon = inShadow(keyValueInput, "eui-v0-icon[name='trashcan']");
      expect(keyTextField, "keyTextField was not found").to.not.equal(null);
      expect(valueFileTextField, "valueFileTextField was not found").to.not.equal(null);
      expect(deleteIcon, "deleteIcon was not found").to.not.equal(null);
    });
  });
});
