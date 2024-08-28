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
 * Integration tests for <e-file-upload-dialog>
 */
import { assert } from "chai";
import "../FileUploadDialog";
import { inShadow, injectHTMLElement } from "../../../../../test/utils";

describe("FileUploadDialog Component Tests", () => {
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
    it("should create a new <e-file-upload-dialog>", async () => {
      const customElement = await inject("<e-file-upload-dialog></e-file-upload-dialog>");
      // check shadow DOM
      const element = inShadow(customElement, "eui-base-v0-dialog");
      assert.isNotNull(element, "file-upload-dialog did not render its dialog component");
    });
  });
});
