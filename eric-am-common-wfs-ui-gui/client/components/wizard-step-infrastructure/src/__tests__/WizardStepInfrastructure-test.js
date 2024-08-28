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
 * Integration tests for <e-wizard-step-infrastructure>
 */
import { expect } from "chai";
import "../WizardStepInfrastructure";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";
import {
  CLUSTER_DESCRIPTION_INSTANTIATE,
  NAMESPACE_DESCRIPTION_INSTANTIATE
} from "../../../../constants/Messages";

describe("WizardStepInfrastructure Component Tests", () => {
  let container;
  let inject;
  before(() => {
    container = document.body.appendChild(document.createElement("div"));
    inject = injectHTMLElement.bind(null, container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  describe("Basic component setup instantiate wizard", () => {
    it("should create a new <e-wizard-step-infrastructure>", async () => {
      const customElement = await inject(
        "<e-wizard-step-infrastructure></e-wizard-step-infrastructure>"
      );
      // check shadow DOM
      const packageSelection = inShadow(customElement, ".package-panel>.heading");
      expect(packageSelection.textContent, '"Package" was not found').to.equal("Package");

      const infrastructure = inShadow(customElement, ".infrastructure-panel>.heading");
      expect(infrastructure.textContent, '"Infrastructure" was not found').to.equal(
        "Infrastructure"
      );

      const clusterDropDownField = inShadow(
        customElement,
        ".infrastructureFieldHolder>.fieldValue>.table>.tr>.td>.dropdown>#cluster-name"
      );
      expect(clusterDropDownField, "Test failed").to.have.a.property("id", "cluster-name");

      const namespaceTextField = inShadow(
        customElement,
        ".infrastructureFieldHolder>.fieldValue>.table>.tr>.td>.textField>#namespace-name"
      );
      expect(namespaceTextField, "Test failed").to.have.a.property("placeholder", "Namespace");

      const clusterDescriptionElement = inShadow(
        customElement,
        ".infrastructureFieldHolder>.description#cluster-description"
      );
      const clusterDescription = inShadow(clusterDescriptionElement, ".content>.descriptionText");
      expect(clusterDescription.textContent, '"Description" not found').to.equal(
        CLUSTER_DESCRIPTION_INSTANTIATE
      );

      const namespaceDescriptionElement = inShadow(
        customElement,
        ".infrastructureFieldHolder>.description#namespace-description"
      );
      const namespaceDescription = inShadow(
        namespaceDescriptionElement,
        ".content>.descriptionText"
      );
      expect(namespaceDescription.textContent, '"Description" not found').to.equal(
        NAMESPACE_DESCRIPTION_INSTANTIATE
      );
    });
  });
});
