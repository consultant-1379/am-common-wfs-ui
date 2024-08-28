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
 * Integration tests for <e-generic-datepicker>
 */
import { assert } from "chai";
import "../GenericDatepicker";
import { allInShadow, injectHTMLElement } from "../../../../../test/utils";

describe("GenericDatepicker Component Tests", () => {
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
    it("should create a new <e-generic-datepicker>", async () => {
      const customElement = await inject("<e-generic-datepicker></e-generic-datepicker>");
      // check shadow DOM
      const datepicker = allInShadow(customElement, "eui-base-v0-datepicker");
      assert.isNotNull(datepicker, "<eui-base-v0-datepicker> component failed to create");
    });
  });
});
