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
 * Integration tests for <e-clusters>
 */
import { assert } from "chai";
import Clusters from "../Clusters";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import { superUserPermissions } from "../../../../../dev/mock-permissions";

describe("Clusters Application Tests", () => {
  let container;
  let inject;
  let clusters;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    clusters = document.createElement("e-clusters");
    clusters.storeConnect = () => {
      return superUserPermissions();
    };
    document.body.appendChild(clusters);
    inject = injectHTMLElement.bind(null, container);
    window.EUI = undefined;
    Clusters.register();
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic application setup", () => {
    it("should create a new  <e-generic-multi-panel> ", async () => {
      await inject(clusters);
      // check shadow DOM
      const clustersTableComponent = inShadow(clusters, "e-generic-multi-panel");
      assert.isNotNull(
        clustersTableComponent,
        "<e-generic-multi-panel> component failed to create"
      );
    });
  });
});
