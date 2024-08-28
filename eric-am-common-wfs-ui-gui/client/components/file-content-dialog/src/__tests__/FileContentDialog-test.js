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
 * Integration tests for <e-file-content-dialog>
 */
import { expect } from "chai";
import "../FileContentDialog";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("FileContentDialog Component Tests", () => {
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
    it("should create a new <e-file-content-dialog> and set content", async () => {
      const contentDialog = await inject(
        '<e-file-content-dialog label="test"content="Test content"></e-file-content-dialog>'
      );
      const codeBlock = inShadow(contentDialog, ".fileContent code");
      expect(codeBlock.innerText, "Text content is not correct").to.equal("Test content");
    });
  });
});
