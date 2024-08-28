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
import * as genericDropdown from "../GenericDropdown";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericDropdown Component Tests", () => {
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
    it("should create a new <e-generic-dropdown>", async () => {
      const customElement = await inject("<e-generic-dropdown></e-generic-dropdown>");
      assert.isNotNull(customElement, "<e-generic-dropdown> component failed to create");
      // check shadow DOM for dropdown element
      const dropdown = allInShadow(customElement, genericDropdown.DROPDOWN_ID);
      assert.isNotNull(dropdown, "<eui-base-v0-dropdown> component failed to create");
    });
  });
});
