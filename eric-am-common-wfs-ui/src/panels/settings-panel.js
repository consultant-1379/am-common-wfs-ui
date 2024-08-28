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

import { TemplateComponent, definition } from '@eui/component';
import { Switch } from '@eui/base/switch';

export default class SettingsPanel extends TemplateComponent {
  static get components() {
    return {
      'eui-switch': Switch,
      'eui-icon': customElements.get('eui-icon'),
    };
  }

  didConnect() {
    const switchControl = this.shadowRoot.querySelector('#theme-switch');

    switchControl.addEventListener('eui-switch:change', this);
  }

  handleEvent(event) {
    if (event.type === 'eui-switch:change') {
      if (event.detail.on) {
        this.bubble('eui-theme-change', { theme: 'light' });
      } else {
        this.bubble('eui-theme-change', { theme: 'dark' });
      }
    }
  }
}

const style = `
:host {
  flex: auto;
  display: flex;
  flex-direction: column;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
.settings-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: auto;
  padding: var(--space-large, 16px) var(--space-xl, 24px) var(--space-xl, 24px);
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-xxl, 32px);
}

.content {
  flex: auto;
  width: 100%;
  display: flex;
  gap: var(--space-base, 8px);
  flex-direction: column;
}

.content-title {
  margin-bottom: var(--space-base, 8px);
  font-size: var(--space-large, 16px);
  font-weight: 700;
}

.content-row {
  display: flex;
  align-items: center;
  gap: var(--space-base, 8px);
}

.label {
  flex: auto;
  opacity: 0.7;
}

.control {
  opacity: 0.7;
}
.control:hover {
  opacity: 1.0;
}
.username {
  font-size: 18px;
  margin-top: var(--space-base, 8px);
}
`;

const template = `
  <div class="settings-panel">
    <div class="profile">
      <eui-icon name="profile" size="44px"></eui-icon>
      <div class="username">username</div>
    </div>
    <div class="content">
      <div class="content-title">My settings</div>
      <div class="content-row">
        <span class="label">Switch theme</span>
        <eui-switch class="control" id="theme-switch" tabindex="0" label-off="Dark" label-on="Light" on></eui-switch>
      </div>
    </div>
  </div>
`;

definition('settings-panel', {
  style,
  template,
})(SettingsPanel);
