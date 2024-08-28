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
 * Integration tests for <e-operations-history-list>
 */
import { assert } from "chai";
import "../OperationsHistoryList";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("OperationsHistoryList Component Tests", () => {
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
    it("should create a new <e-operations-history-list>", async () => {
      const customElement = await inject("<e-operations-history-list></e-operations-history-list>");

      const listElement = inShadow(customElement, "ul");
      assert.isNotNull(listElement, "No list element has been rendered");
    });
  });
});
