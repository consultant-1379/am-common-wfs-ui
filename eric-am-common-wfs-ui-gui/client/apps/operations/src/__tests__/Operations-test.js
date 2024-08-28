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
 * Integration tests for <e-operations>
 */
import { assert } from "chai";
import Operations from "../Operations";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";
import { getConfigs } from "../../../../../dev/mock-configs";

describe("Operations Application Tests", () => {
  let container;
  let inject;
  let operations;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    operations = document.createElement("e-operations");
    operations.storeConnect = () => {
      return Object.assign({}, superUserPermissions(), getConfigs());
    };
    document.body.appendChild(operations);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    Operations.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new  <e-generic-multi-panel> ", async () => {
      await inject(operations);
      // check shadow DOM
      const operationsTableComponent = inShadow(operations, "e-generic-multi-panel");
      assert.isNotNull(
        operationsTableComponent,
        "<e-generic-multi-panel> component failed to create"
      );
    });
  });
});
