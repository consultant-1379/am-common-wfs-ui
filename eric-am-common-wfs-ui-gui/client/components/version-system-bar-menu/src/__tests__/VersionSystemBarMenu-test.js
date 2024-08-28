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
 * Integration tests for <e-version-system-bar-menu>
 */
import { assert } from "chai";
import "../Main";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("VersionSystemBarMenu Component Tests", () => {
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
    it("should create a new <e-version-system-bar-menu>", async () => {
      const customElement = await inject("<e-version-system-bar-menu></e-version-system-bar-menu>");
      // check shadow DOM
      const versionHolder = inShadow(customElement, ".version-system-bar-holder");
      assert.isNotNull(versionHolder, "<e-version-system-bar-menu> failed to create");
    });
  });
});
