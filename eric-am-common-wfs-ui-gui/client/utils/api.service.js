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

// common
import axios from "axios";

// helpers
import { getErrorMessage, RESOURCES_URL, VNF_IDENTIFIER } from "./RestUtils";
import { showNotification } from "./CommonUtils";
import { DialogModel } from "../components/generic-dialog/src/DialogModel";

// constants
import {
  FORBIDDEN_ERROR_DESCRIPTION_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE
} from "../constants/Messages";

class RequestService {
  constructor(opts) {
    this.service = axios.create(opts);

    this.service.interceptors.response.use(this.responseSuccess, this.responseError);
  }

  responseSuccess(response) {
    const { data = "" } = response || {};

    // if token expired, do redirect to login page
    if (String(data).includes("IDENTITY AND ACCESS MANAGEMENT")) {
      location.reload(); // eslint-disable-line
    }

    return response;
  }

  responseError(error) {
    const { response } = error;

    if (!response && axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!handleErrorInAxiosInterceptor(error)) {
      return Promise.reject(error);
    }

    const { title, description } = getErrorMessage(response);

    if (response.status === 403) {
      showNotification(FORBIDDEN_ERROR_MESSAGE, FORBIDDEN_ERROR_DESCRIPTION_MESSAGE, true);
    } else if (isAddOrDeleteNodeOperation(response.config.url)) {
      showNotification(title, description, true, 0);
    } else if (isBackupGetOrDelete(response)) {
      showNotification(title, description, true);
    } else if (isLCMOperation(response.config.url)) {
      showDialog(title, description);
    } else {
      showNotification(title, description, true);
    }

    return Promise.reject(error);
  }
}

function showDialog(label, content) {
  const dialog = new DialogModel(label, content);
  const component = document.createElement("e-generic-dialog");

  dialog.setButtonLabels(["Ok"]);
  dialog.setWarningButtonIndex(1);

  component.handleClick = () => {
    document.body.removeChild(component);
  };
  component.style.color = "var(--text, rgb(36,36, 36))";
  component.dialogModel = dialog;
  document.body.appendChild(component);
}

function isValidateNamespaceOperation(url, method) {
  return url.includes("validateNamespace") && method === "get";
}

function isGetPodsOperation(url, method) {
  return url.includes(RESOURCES_URL) && url.includes("pods") && method === "get";
}

function isGetDowngradeInfoOperation(url) {
  return url.includes(RESOURCES_URL) && url.includes("downgradeInfo");
}

function handleErrorInAxiosInterceptor(error) {
  // don't notify for some failed /vnflcm/v1/resources/<id>/pods requests
  const { url } = error.response.config;

  if (
    error.response &&
    isGetPodsOperation(url, error.response.config.method) &&
    (error.response.status === 404 || error.response.status === 409)
  ) {
    return false;
  }

  if (error.response && isValidateNamespaceOperation(url, error.response.config.method)) {
    return false;
  }

  if (isGetDowngradeInfoOperation(url)) {
    return false;
  }

  // ignore upgrade lcm because we want to differentiate between Rollback and Upgrade
  if (url.includes(VNF_IDENTIFIER) && url.includes("change_vnfpkg")) {
    return false;
  }

  return true;
}

function isAddOrDeleteNodeOperation(url) {
  return /addNode|deleteNode/.test(url);
}

function isBackupGetOrDelete(response) {
  const { url, method } = response.config;

  return (
    url.includes(VNF_IDENTIFIER) &&
    url.includes("backups") &&
    (method === "get" || method === "delete")
  );
}

function isLCMOperation(url) {
  return url.includes(VNF_IDENTIFIER);
}

export default RequestService;
