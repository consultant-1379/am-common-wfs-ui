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
export class DialogModel {
  constructor(label, content) {
    this.label = label;
    this.content = content;
    this.nextParagraph = null;
    this.buttonLabels = [];
  }

  setLabel(label) {
    this.label = label;
  }

  setContent(content) {
    this.content = content;
  }

  setNextParagraph(nextParagraph) {
    this.nextParagraph = nextParagraph;
  }

  setButtonLabels(buttonLabels) {
    this.buttonLabels = buttonLabels;
    this.setPrimaryButtonIndex();
  }

  setPrimaryButtonIndex(index) {
    if (index >= 0) {
      this.indexOfPrimaryButton = index;
    }
  }

  setWarningButtonIndex(index) {
    if (index >= 0) {
      this.indexOfWarningButton = index;
    }
  }
}
