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
 * Packages is defined as
 * `<e-packages>`
 *
 * @extends {App}
 */
import { App, html, definition } from '@eui/app';
import style from './packages.css';

export default class Packages extends App {
  // Uncomment this block to add initialization code
  // constructor() {
  //   super();
  //   // initialize
  // }

  static get components() {
    return {
      ...super.components, // if extending
      // register components here
    };
  }

  didConnect() {
    this.bubble('app:lineage', { metaData: this.metaData });
    this.bubble('app:subtitle', { subtitle: '' });
  }

  /**
   * Render the <e-packages> app. This function is called each time a
   * prop changes.
   */
  render() {
    return html`<h1>Your app markup goes here</h1>`;
  }
}

definition('e-packages', {
  style,
})(Packages);

Packages.register();
