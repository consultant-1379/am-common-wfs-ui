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

// settings
import errorsList from '../settings/errors.json';

const ICONS_TYPE = {
  error: 'cross',
  warning: 'triangle-warning',
  success: 'check',
};

const ICONS_TYPE_COLOR = {
  error: 'var(--red-42)',
  warning: 'var(--yellow-43)',
  success: 'green',
};

const DEFAULT_ERROR_NOTIFY = {
  title: 'Sorry',
  description:
    'We are experiencing technical difficulties with our services. Please try again later.',
  type: 'error',
};

export const generateNotificationSimple = function (params) {
  const { title = '', description = '', type, duration = 5000 } = params;
  const notificationEl = document.createElement('eui-notification');

  notificationEl.description = description;
  notificationEl.textContent = title;
  notificationEl.timeout = duration;

  notificationEl.showNotification();
};

export const generateNotificationWithHtml = function (params) {
  const {
    title = '',
    description = '',
    type = 'success',
    duration = 5000,
  } = params;
  const notificationEl = this.createElement('eui-notification');
  const notificationDescriptionEl = this.createElement('div');

  notificationDescriptionEl.setAttribute('slot', 'description');

  notificationDescriptionEl.innerHTML = description;
  notificationEl.timeout = duration;

  notificationEl.innerHTML = `<div style="display: flex;align-items: center;">
    <eui-icon name="${ICONS_TYPE[type]}" color="${ICONS_TYPE_COLOR[type]}"></eui-icon>
    <span style="margin-left: 10px;">${title}</span>
  </div>`;

  notificationEl.appendChild(notificationDescriptionEl);
  notificationEl.showNotification();
};

export const generateNotificationByErrorCode = function (error) {
  const { code: errorCode } = error || {};
  const notify =
    errorsList.find(error => error.code.some(code => code === errorCode)) ||
    DEFAULT_ERROR_NOTIFY;

  generateNotificationWithHtml.call(this, notify);
};
