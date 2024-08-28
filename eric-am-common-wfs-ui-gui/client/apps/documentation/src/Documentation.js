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

// common libraries
import { definition } from "@eui/component";
import { App, html } from "@eui/app";
import showdown from "showdown";
import { querySelectorAllDeep, querySelectorDeep } from "query-selector-shadow-dom";

// styles
import style from "./documentation.css";

// helpers
import { fetchMDFile } from "../../../api/common";

/**
 * Do not use without express permission from UX and CPI.
 *
 * E-VNFM have a temporary exemption to use this.
 */

/**
 * Documentation is defined as
 * `<e-documentation>`
 *
 * Declaratively create application
 * @example
 * <e-documentation></e-documentation>
 *
 * @extends {App}
 */
@definition("e-documentation", {
  style
})
export default class Help extends App {
  componentDidConnect() {
    this.addQuerySelectors();
    this.filename = "user_guide";
    this._fetchMDFile({ filename: this.filename });
  }

  /**
   * Fetch documentation from MD file
   *
   * @returns {Promise<void>}
   */
  async _fetchMDFile(payload) {
    try {
      const response = await fetchMDFile(payload);

      const text = response;
      const converter = new showdown.Converter();
      const value = converter.makeHtml(text);
      const node = document.createElement("div");

      node.setAttribute("class", "converted-data");
      node.innerHTML = value;
      this._checkInternals(node);

      const tile = this.shadowRoot.querySelector(".converted-data");

      if (tile != null) {
        this.shadowRoot.removeChild(tile);
      }

      const content = this.shadowRoot.querySelector(".content");

      content.appendChild(node);
    } catch (error) {}
  }

  addQuerySelectors() {
    window.querySelectorDeep = function qsDeep(htmlIdentifier) {
      return querySelectorDeep(htmlIdentifier);
    };
    window.querySelectorAllDeep = function qsAllDeep(htmlIdentifier) {
      return querySelectorAllDeep(htmlIdentifier);
    };
  }

  _checkInternals(node) {
    const links = node.querySelectorAll("a");

    links.forEach(link => {
      const linkValue = link.href.replace(window.location.origin + window.location.pathname, "");

      if (link.href.includes(window.location.origin) && link.href.includes("http")) {
        link.setAttribute("data-ref", linkValue);
        link.setAttribute("class", "link");
        link.removeAttribute("href");
        link.addEventListener("click", this._handleLinkClick.bind(this), false);
      } else {
        link.setAttribute("href", linkValue);
      }
    });
  }

  _handleLinkClick(e) {
    const target = e.currentTarget;
    const ref = target.attributes["data-ref"].value;
    const element = this.shadowRoot.querySelector(`#${ref}`);

    if (element) {
      element.scrollIntoView();
    }
  }

  _handleScrollToTop() {
    const element = this.shadowRoot.querySelector(`.content`);

    element.scrollIntoView();
  }

  render() {
    return html`
      <div class="help-container">
        <div class="content"></div>
        <eui-base-v0-button
          class="scrollToTop"
          icon="arrow-up"
          @click=${this._handleScrollToTop.bind(this)}
        ></eui-base-v0-button>
      </div>
    `;
  }
}
