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
 * Integration tests for <e-resource-add-node>
 */
import { assert } from "chai";
import ResourceAddNode from "../ResourceAddNode";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";

describe("ResourceAddNode Application Tests", () => {
  let container;
  let inject;
  let resourceAddNode;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    resourceAddNode = document.createElement("e-resource-add-node");
    resourceAddNode.storeConnect = () => {
      return superUserPermissions();
    };
    container = document.body.appendChild(resourceAddNode);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined; // stub out the locale
    ResourceAddNode.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new <e-resource-add-node>", async () => {
      await inject(resourceAddNode);
      // check shadow DOM
      const addNodeComponent = inShadow(resourceAddNode, "e-resource-add-node-panel");
      assert.isNotNull(addNodeComponent, "<e-resource-add-node-panel> component failed to create");
    });
  });
});
