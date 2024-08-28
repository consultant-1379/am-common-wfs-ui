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
 * Integration tests for <e-unavailable-page-component>
 */
import { assert } from "chai";
import "../UnavailablePageComponent";
import { injectHTMLElement } from "../../../../../test/utils";

describe("UnavailablePageComponent Component Tests", () => {
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
    it("should create a new <e-unavailable-page-component>", async () => {
      const customElement = await inject(
        "<e-unavailable-page-component></e-unavailable-page-component>"
      );

      assert.isNotNull(customElement);
    });
  });
});
