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
 * Integration tests for <e-generic-dropdown>
 */
import { assert } from "chai";
import * as genericComboBox from "../GenericComboBox";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericComboBox Component Tests", () => {
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
    it("should create a new <e-generic-combo-box>", async () => {
      const customElement = await inject("<e-generic-combo-box></e-generic-combo-box>");
      assert.isNotNull(customElement, "<e-generic-combo-box> component failed to create");
      // check shadow DOM for dropdown element
      const comboBox = allInShadow(customElement, genericComboBox.COMBOBOX_ID);
      assert.isNotNull(comboBox, "<eui-base-v0-combo-box> component failed to create");
    });
  });
});
