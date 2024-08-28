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
 * Integration tests for <e-packages-filter-panel>
 */
import { assert } from "chai";
import "../PackagesFilterPanel";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("PackagesFilterPanel Component Tests", () => {
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
    it("should create a new <e-packages-filter-panel>", async () => {
      const customElement = await inject("<e-packages-filter-panel></e-packages-filter-panel>");
      assert.isNotNull(customElement);
    });
  });

  describe("Should check Dropdown component", () => {
    it("should contain <e-generic-dropdown> component", async () => {
      const customElement = await inject("<e-packages-filter-panel></e-packages-filter-panel>");
      assert.isNotNull(customElement);
      const dropdown = allInShadow(customElement, "e-generic-dropdown");
      assert.isNotNull(dropdown, "<e-generic-dropdown> component failed to create");
    });
  });

  describe("Should check Datepicker component", () => {
    it("should contain <e-filter-datepicker> component", async () => {
      const customElement = await inject("<e-packages-filter-panel></e-packages-filter-panel>");
      assert.isNotNull(customElement);
      const datePicker = allInShadow(customElement, "e-filter-datepicker");
      assert.isNotNull(datePicker, "<e-filter-datepicker> component failed to create");
    });
  });
});
