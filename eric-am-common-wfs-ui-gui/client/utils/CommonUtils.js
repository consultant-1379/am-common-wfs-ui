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
import { html } from "@eui/lit-component";
import natsort from "natsort";
import { querySelectorDeep } from "query-selector-shadow-dom";
import { DialogModel } from "../components/generic-dialog/src/DialogModel";
import "../components/generic-datepicker/src/GenericDatepicker";
import "../components/generic-dropdown/src/GenericDropdown";

// services
import { logger } from "./logger.service";

import {
  CANCEL_BUTTON,
  FORBIDDEN_ERROR_DESCRIPTION_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  TERMINATE_BUTTON,
  TERMINATION_CONFIRMATION_MESSAGE_CONTINUE,
  TERMINATION_CONFIRMATION_MESSAGE_SINGLE,
  FAILED_PACKAGE_ONBOARD
} from "../constants/Messages";
import {
  INPUT_METHOD_ALL,
  PACKAGES_USAGE_STATE_NOT_IN_USE,
  VNFLCM_INTERFACES_INSTANTIATE,
  CLUSTER_USAGE_STATE_IN_USE,
  EVNFM_UI_ROLE,
  EVNFM_SUPER_USER_ROLE,
  NOT_IN_USE,
  IN_USE,
  TOSCA_DEFINITIONS_VERSIONS,
  VNFLCM_INTERFACES_UPGRADE,
  VNFLCM_INTERFACES_UPGRADE_V1_3
} from "../constants/GenericConstants";
import {
  COMPLETED,
  FAILED,
  FAILED_TEMP,
  PENDING,
  PROCESSING,
  ROLLED_BACK,
  ROLLING_BACK,
  RUNNING,
  STARTING,
  SUCCEEDED,
  OKAY,
  UNKNOWN,
  SUPPORTED_OPERATION_STATE,
  UNSUPPORTED_OPERATION_STATE,
  YES,
  UPLOADING,
  ONBOARDED,
  CREATED,
  ERROR
} from "../constants/States";

// Column information for Packages table during LCM operation
export const PACKAGES_COLUMNS = [
  { title: "Package name", attribute: "appCompositeName", width: "20%", sortable: true },
  { title: "Type", attribute: "appProductName", sortable: true },
  { title: "Software version", attribute: "appSoftwareVersion", sortable: true },
  { title: "Package version", attribute: "descriptorVersion", sortable: true },
  {
    title: "Provider",
    attribute: "appProvider",
    sortable: true
  },
  { title: "Security option", attribute: "packageSecurityOptionString", sortable: true },
  { title: "Usage state", attribute: "usageState", sortable: true }
  /* TODO Add back in columns when appropriate information is available in future APIs
  { title: "Onboarded at", attribute: "onboardedAt", sortable: true }
  */
];

// Column information for Packages page
export const PACKAGES_PAGE_COLUMNS = [
  { title: "Package name", attribute: "appCompositeName", width: "20%", sortable: true },
  { title: "Type", attribute: "appProductName", sortable: true },
  { title: "Software version", attribute: "appSoftwareVersion", sortable: true },
  { title: "Package version", attribute: "descriptorVersion", sortable: true },
  {
    title: "Provider",
    attribute: "appProvider",
    sortable: true
  },
  { title: "Security option", attribute: "packageSecurityOptionString", sortable: true },
  { title: "Usage state", attribute: "usageState", sortable: true },
  { title: "Status", attribute: "onboardingState", sortable: true, table: "onboardingState" }
  /* TODO Add back in columns when appropriate information is available in future APIs
  { title: "Onboarded at", attribute: "onboardedAt", sortable: true }
  */
];

// Components column names
export const RESOURCE_COMPONENTS_COLUMNS = {
  name: "name",
  state: "status"
};

export const PACKAGE_SECURITY_OPTIONS = {
  UNSIGNED: "Unsigned",
  OPTION_1: "Option 1",
  OPTION_2: "Option 2"
};

export const OPERATION_VALUES = ["Instantiate", "Change vnfpkg", "Scale", "Terminate"];

export const OPERATION_STATE_VALUES = [
  "Starting",
  "Processing",
  "Rolling back",
  "Rolled back",
  "Completed",
  "Failed",
  "Failed temp"
];

export const PACKAGE_STATUS_VALUES = ["Created", "Uploading", "Processing", "Onboarded", "Error"];

function calculateWidthForKeys(listOfKeys) {
  const maxCharLength = Math.max(...listOfKeys.map(item => item.length));
  const width = Math.round(maxCharLength / 2);
  return width;
}

export function getLongestKey(firstListKeys, secondListKeys, widthUnit) {
  const longestFromFirst = calculateWidthForKeys(firstListKeys);
  const longestFromSecond = calculateWidthForKeys(secondListKeys);
  const longestKey = Math.max(longestFromFirst, longestFromSecond);
  return longestKey + widthUnit;
}

const _isFilterValueValid = (column, value, columnAttributes, filterText) => {
  return (
    value !== null &&
    value !== undefined &&
    value
      .toString()
      .toLowerCase()
      .includes(filterText.toLowerCase()) &&
    (columnAttributes.includes(column) || columnAttributes.length === 0)
  );
};

export function filterData(filterText, dataArray = [], columnsAttributes = []) {
  const dataArrayFiltered = [];
  if (filterText && filterText.length > 0) {
    dataArray.forEach(row => {
      Object.entries(row).every(([column, value]) => {
        if (_isFilterValueValid(column, value, columnsAttributes, filterText)) {
          dataArrayFiltered.push(row);
          return false;
        }
        return true;
      });
    });
    return dataArrayFiltered;
  }
  return dataArray;
}

export function sortNatural(data, isDesc, colNo) {
  data.sort((a, b) => {
    const ns = natsort({ insensitive: true, desc: isDesc });
    return ns(a[colNo], b[colNo]);
  });
  return data;
}

export function sortState(data, isDesc, columnAttribute) {
  // Pending, Running, Succeeded, Failed & Unknown are the phases of the components(Pods)
  // The remaining states are the state of the lifecycle operation perfomred
  const stateEnum = {
    Running: 6,
    Pending: 3,
    Unknown: 2,
    Succeeded: 7,
    Failed: 0,
    Failed_temp: 1,
    Rolling_back: 2,
    Processing: 3,
    Starting: 4,
    Rolled_back: 5,
    Completed: 6,
    undefined: 7
  };
  const stateSortRule = (a, b) => {
    a = stateEnum[a[columnAttribute]];
    b = stateEnum[b[columnAttribute]];
    return a - b;
  };
  if (!isDesc) {
    data.sort(stateSortRule);
  } else {
    data.sort(stateSortRule).reverse();
  }
  return data;
}

export function sortCol(event) {
  const tableData = event.target.data;
  const columnAttribute = event.detail.column.attribute;
  const isDesc = event.detail.sort === "dec";
  const isColState = event.detail.column.isColState; // eslint-disable-line prefer-destructuring
  if (isColState) {
    if (!tableData.every(value => value[columnAttribute] === tableData[0][columnAttribute])) {
      sortState(tableData, isDesc, columnAttribute);
    }
  } else {
    sortNatural(tableData, isDesc, columnAttribute);
  }
  return tableData;
}

export function getStateCustomIcon(state) {
  const currentState = state.toUpperCase();
  const item = {};
  switch (currentState) {
    case STARTING:
    case PROCESSING:
    case ROLLING_BACK:
    case PENDING:
    case UPLOADING:
      return html`
        <eui-base-v0-loader size="small"></eui-base-v0-loader>
      `;
    case COMPLETED:
    case SUCCEEDED:
    case SUPPORTED_OPERATION_STATE:
    case RUNNING:
    case OKAY:
    case YES:
    case ONBOARDED:
    case CREATED:
      item.colour = "green";
      item.icon = "check";
      break;
    case ROLLED_BACK:
      item.icon = "restore";
      break;
    case FAILED_TEMP:
    case UNKNOWN:
      item.colour = "orange";
      item.icon = "triangle-warning";
      break;
    case FAILED:
    case ERROR:
    case UNSUPPORTED_OPERATION_STATE:
      item.colour = "red";
      item.icon = "cross";
      break;
    default:
      break;
  }
  return html`
    ${currentState !== ""
      ? html`
          <eui-v0-icon
            class="custom-table__cell_icon"
            name="${item.icon}"
            color=${item.colour}
          ></eui-v0-icon>
        `
      : html``}
  `;
}

export function isEmpty(object) {
  return object && Object.keys(object).length === 0;
}

export function getCauses(nodeType, singlePackage) {
  if (
    nodeType.properties &&
    nodeType.properties.lcm_operations_configuration &&
    nodeType.properties.lcm_operations_configuration.default &&
    nodeType.properties.lcm_operations_configuration.default.heal &&
    nodeType.properties.lcm_operations_configuration.default.heal.causes
  ) {
    singlePackage.causes = nodeType.properties.lcm_operations_configuration.default.heal.causes;
  }
}

export function parseBackendExtensionsData(descriptorModel) {
  const parsedData = [];
  const modifiableAttributesExtensions =
    descriptorModel.data_types["ericsson.datatypes.nfv.VnfInfoModifiableAttributesExtensions"];
  if (
    modifiableAttributesExtensions !== undefined &&
    modifiableAttributesExtensions.properties !== undefined
  ) {
    Object.entries(modifiableAttributesExtensions.properties).forEach(([key, value]) => {
      const validValues = value.entry_schema.constraints.filter(obj => obj.valid_values);
      const extensionsOptions = !validValues.isEmpty ? validValues[0].valid_values : [];
      parsedData.push({ extensionName: key, defaults: value.default, options: extensionsOptions });
    });
  }
  return parsedData;
}

export function createInstantiationLevelsObject(data) {
  const instantiationLevelsObject = {};
  const levelsName = [];
  instantiationLevelsObject.default_level = data.properties.default_level;
  Object.keys(data.properties.levels).forEach(key => {
    levelsName.push(key);
  });
  instantiationLevelsObject.levels = levelsName;
  return instantiationLevelsObject;
}

export function createDeployableModuleAssociatedArtifacts(data) {
  const associatedArtifacts = [];
  if (data.properties !== undefined && data.properties.associatedArtifacts !== undefined) {
    data.properties.associatedArtifacts.forEach(item => {
      associatedArtifacts.push(item);
    });
  }
  return associatedArtifacts;
}

export function parseBackendInstantiationLevelsData(descriptorModel) {
  const parsedData = [];
  const topologyTemplate = descriptorModel.topology_template;
  const hasPolicies =
    topologyTemplate !== undefined &&
    topologyTemplate.policies !== undefined &&
    Array.isArray(topologyTemplate.policies);

  if (hasPolicies) {
    topologyTemplate.policies.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        if (value.type === "tosca.policies.nfv.InstantiationLevels") {
          parsedData.push({
            instantiationLevelName: key,
            value: createInstantiationLevelsObject(value)
          });
        }
      });
    });
  }
  return parsedData;
}

export function parseBackendDeployableModulesData(descriptorModel) {
  const parsedData = [];
  const topologyTemplate = descriptorModel.topology_template;
  if (topologyTemplate !== undefined && topologyTemplate.node_templates !== undefined) {
    Object.entries(topologyTemplate.node_templates).forEach(([key, value]) => {
      if (value.type === "tosca.nodes.nfv.DeployableModule") {
        parsedData.push({
          name: key,
          associatedArtifacts: createDeployableModuleAssociatedArtifacts(value)
        });
      }
    });
  }
  return parsedData;
}

export function parseDescriptorModel(singlePackage, descriptorModel, vnfLifecycleType) {
  const nodeType =
    descriptorModel && descriptorModel.node_types[Object.keys(descriptorModel.node_types)[0]];
  const isToscaVersion13 =
    descriptorModel &&
    TOSCA_DEFINITIONS_VERSIONS["1.3"] === descriptorModel.tosca_definitions_version;
  const vnfLifecycleTypeParsed =
    isToscaVersion13 && vnfLifecycleType === VNFLCM_INTERFACES_UPGRADE
      ? VNFLCM_INTERFACES_UPGRADE_V1_3
      : vnfLifecycleType;
  const vnfLcmInterface = isToscaVersion13
    ? nodeType && nodeType.interfaces.Vnflcm.operations[vnfLifecycleTypeParsed]
    : nodeType && nodeType.interfaces.Vnflcm[vnfLifecycleType];

  if (descriptorModel) {
    singlePackage.description = descriptorModel.description;
    singlePackage.deployableModules = parseBackendDeployableModulesData(descriptorModel);
    singlePackage.description = descriptorModel && descriptorModel.description;
  }

  if (vnfLcmInterface && vnfLcmInterface.inputs) {
    const lifeCycleTypeKey = vnfLcmInterface.inputs.additional_parameters.type;

    singlePackage.additionalAttributes = {};
    if (
      descriptorModel.data_types[lifeCycleTypeKey] &&
      descriptorModel.data_types[lifeCycleTypeKey].properties
    ) {
      if (descriptorModel.data_types[lifeCycleTypeKey].properties.namespace) {
        const { default: value = "" } =
          descriptorModel.data_types[lifeCycleTypeKey].properties.namespace || {};

        singlePackage.defaultNamespace = value;
      } else {
        singlePackage.defaultNamespace = "";
      }

      singlePackage.defaultGeneralProperties = parseGeneralAttributes(
        descriptorModel.data_types[lifeCycleTypeKey].properties,
        vnfLifecycleType
      );
      singlePackage.descriptorModel = Object.values(
        descriptorModel.data_types[lifeCycleTypeKey].properties
      );

      singlePackage.descriptorModel.forEach(function ensureFormat(element, index) {
        if (!element.metadata) {
          element.metadata = {};
        }

        if (!element.metadata.chart_param) {
          element.metadata.chart_param = Object.keys(
            descriptorModel.data_types[lifeCycleTypeKey].properties
          )[index];
        }

        if (isComplexType(element) && !element.entry_schema) {
          element.entry_schema = { type: "string" };
        }

        singlePackage.additionalAttributes[element.metadata.chart_param] = element.default;

        element.type = isPasswordType(element.metadata.chart_param) ? "password" : element.type;
      });
    }

    // Parsing causes for heal only
    if (vnfLifecycleType === "heal") {
      getCauses(nodeType, singlePackage);
    }

    const parsedExtensions = parseBackendExtensionsData(descriptorModel);
    const parsedInstantiationLevels = parseBackendInstantiationLevelsData(descriptorModel);

    singlePackage.vnfInfoModifiableAttributesExtensions = parsedExtensions;
    singlePackage.instantiationLevels = parsedInstantiationLevels;
    singlePackage.scalingAspects = parseParamsForScalingAspects(descriptorModel);
    singlePackage.instantiationLevelsObj = parseParamsForInstantiationLevels(descriptorModel);
  } else {
    singlePackage.defaultGeneralProperties = parseGeneralAttributes();
    singlePackage.instantiationLevels = [];
    singlePackage.scalingAspects = [];
    singlePackage.vnfInfoModifiableAttributesExtensions = [];
    singlePackage.instantiationLevelsObj = {};
  }
}

export function isComplexType(attribute = {}) {
  const type = isPlainObject(attribute) ? attribute.type : {};
  const complexTypes = ["list", "map"];

  return complexTypes.includes(type);
}

export function isPasswordType(fieldName) {
  return String(fieldName)
    .toLowerCase()
    .includes("password");
}

export const ADDITIONAL_ATTRIBUTES_BLACK_LIST = {
  Instantiate: [
    "namespace",
    "applicationTimeOut",
    "disableOpenapiValidation",
    "skipJobVerification",
    "skipVerification",
    "helmNoHooks",
    "cleanUpResources",
    "manoControlledScaling",
    "helm_client_version"
  ],
  Upgrade: [
    "applicationTimeOut",
    "disableOpenapiValidation",
    "skipJobVerification",
    "skipVerification",
    "helmNoHooks",
    "cleanUpResources",
    "manoControlledScaling",
    "helm_client_version",
    "skipMergingPreviousValues",
    "persistScaleInfo",
    "persistDMConfig"
  ]
};

/**
 * Parse initial values for general attributes.
 *
 * @param {object} properties: current descriptorModel
 * @returns {object}
 */
function parseGeneralAttributes(properties = {}, type) {
  const generalProperties = {
    applicationTimeOut: "3600",
    disableOpenapiValidation: true,
    skipJobVerification: false,
    skipVerification: false,
    helmNoHooks: false,
    cleanUpResources: true,
    manoControlledScaling: false,
    helm_client_version: "3.8",
    skipMergingPreviousValues: false,
    persistScaleInfo: true,
    persistDMConfig: false
  };

  const generalPropertiesWithDefaultValues = Object.entries(generalProperties)
    .map(([key, defaultUIValue]) => {
      const { default: defaultVNFDValue } = properties[key] || {};

      key = key === "helm_client_version" ? "helmClientVersion" : key;
      const value = typeof defaultVNFDValue === "undefined" ? defaultUIValue : defaultVNFDValue;

      return [key, value];
    })
    .filter(([key]) => {
      const upgradeParams = ["skipMergingPreviousValues", "persistDMConfig", "persistScaleInfo"];

      if (type === "instantiate") {
        return !upgradeParams.includes(key);
      }

      return true;
    });

  logger.log("parseGeneralAttributes - parsed properties: ", generalPropertiesWithDefaultValues);
  return Object.fromEntries(generalPropertiesWithDefaultValues);
}

/**
 * Parse params related to scaling aspects in topology_template
 *
 * @param {object} descriptorModel: current descriptorModel
 * @returns {array}
 */
function parseParamsForScalingAspects(descriptorModel) {
  const { topology_template: topologyTemplate = {} } = descriptorModel || {};
  const { policies = [] } = topologyTemplate;
  const hasPolicies = policies && Array.isArray(policies);

  if (hasPolicies) {
    const scalingAspectPolicy =
      policies.find(policy => {
        return Object.entries(policy).find(
          ([, value]) => value.type === "tosca.policies.nfv.ScalingAspects"
        );
      }) || {};
    const aspectsObj =
      Object.keys(scalingAspectPolicy).map(key => {
        return scalingAspectPolicy[key].properties.aspects;
      })[0] || {};

    return Object.keys(aspectsObj).map(aspectKey => {
      return {
        ...aspectsObj[aspectKey],
        aspectId: aspectKey
      };
    });
  }

  return [];
}

/**
 * Parse params related to instantiation levels in topology_template
 *
 * @param {object} descriptorModel: current descriptorModel
 * @returns {object}
 */
function parseParamsForInstantiationLevels(descriptorModel) {
  const { topology_template: topologyTemplate = {} } = descriptorModel || {};
  const { policies = [] } = topologyTemplate;
  const hasPolicies = policies && Array.isArray(policies);

  if (hasPolicies) {
    const instantiationLevelsPolicy =
      policies.find(policy => {
        return Object.entries(policy).find(
          ([, value]) => value.type === "tosca.policies.nfv.InstantiationLevels"
        );
      }) || {};
    const instantiationLevelsObj =
      Object.keys(instantiationLevelsPolicy).map(key => {
        return instantiationLevelsPolicy[key].properties;
      })[0] || {};

    return instantiationLevelsObj;
  }

  return {};
}

export function isValidTimeoutRange(timeOut) {
  const maxTimeout = 1000000000;
  const isTimeoutPositiveInteger = /^\d+$/.test(timeOut);
  if (isTimeoutPositiveInteger && parseInt(timeOut, 10) <= maxTimeout) {
    return true;
  }
  return false;
}

export function isEmptyString(str) {
  return !str || str.length === 0;
}

export function formatBackendSinglePackageData(
  p,
  key,
  lifecycleOperationType = VNFLCM_INTERFACES_INSTANTIATE
) {
  const singlePackage = {};
  singlePackage.appPkgId = p.appPkgId;
  singlePackage.appDescriptorId = p.appDescriptorId;
  singlePackage.appCompositeName = `${p.appProvider}.${p.appProductName}.${p.appSoftwareVersion}.${
    p.descriptorVersion
  }`;
  singlePackage.appProductName = p.appProductName;
  singlePackage.appSoftwareVersion = p.appSoftwareVersion;
  singlePackage.descriptorVersion = p.descriptorVersion;
  singlePackage.appProvider = p.appProvider;
  singlePackage.usageState = p.usageState === PACKAGES_USAGE_STATE_NOT_IN_USE ? NOT_IN_USE : IN_USE;
  singlePackage.onboardedAt = p.onboardedAt;
  singlePackage.supportedOperations = p.supportedOperations || [];
  singlePackage.packageSecurityOption = p.packageSecurityOption;
  singlePackage.packageSecurityOptionString =
    PACKAGE_SECURITY_OPTIONS[p.packageSecurityOption] || "";
  singlePackage.onboardingState = toTitleCase(p.onboardingState);
  singlePackage.errorDetails =
    p.errorDetails || (p.onboardingFailureDetails && p.onboardingFailureDetails.detail) || "";

  try {
    parseDescriptorModel(singlePackage, p.descriptorModel, lifecycleOperationType);
  } catch (error) {
    console.error("Error when parsing descriptor: ", error);
  }
  return singlePackage;
}

export function formatBackendPackageData(packages) {
  return packages.reduce(
    (packageList, p, key) => [...packageList, formatBackendSinglePackageData(p, key)],
    []
  );
}

export function showNotification(title, description, isError, timeout = 5000, clickRedirectPage) {
  const notification = document.createElement("eui-base-v0-notification");
  notification.textContent = title;
  notification.timeout = timeout;
  const notificationDescription = document.createElement("div");
  notificationDescription.setAttribute("style", "word-break: break-word");
  if (clickRedirectPage) {
    notificationDescription.addEventListener("click", () => {
      window.EUI.Router.goto(clickRedirectPage);
    });
  }
  notificationDescription.setAttribute("slot", "description");
  notificationDescription.innerHTML = description;
  notification.appendChild(notificationDescription);

  if (isError) {
    notification.style.setProperty(
      "--notification-background",
      "var(--notification-border-error,rgb(194, 82, 88)"
    );
  } else {
    notification.style.setProperty("--notification-background", "var(--green,rgb(52, 176, 127)");
  }
  notification.style.setProperty("--text", "rgb(250, 250, 250)");
  notificationDescription.style.color = "var(--text, rgb(250, 250, 250))";

  notification.showNotification();
}

// TODO create new notification component and replace this method
export function showOnboardingErrorNotification(description) {
  const notification = document.createElement("eui-base-v0-notification");
  notification.textContent = FAILED_PACKAGE_ONBOARD;
  const notificationDescription = document.createElement("div");
  notificationDescription.setAttribute("style", "word-break: break-word");

  notificationDescription.setAttribute("slot", "description");
  notificationDescription.innerHTML = description;
  notification.appendChild(notificationDescription);

  notification.style.setProperty(
    "--notification-background",
    "var(--notification-border-error,rgb(194, 82, 88)"
  );

  notification.style.setProperty("--text", "rgb(250, 250, 250)");
  notificationDescription.style.color = "var(--text, rgb(250, 250, 250))";

  notification.showNotification();
}

export function formatDate(date) {
  return date.substring(0, date.lastIndexOf(":")).replace("T", " ");
}

export function toTitleCase(input) {
  return input.replace(/[\w]/g, (match, offset) =>
    offset === 0 ? match.toUpperCase() : match.toLowerCase()
  );
}
export function mapSingleOperation(singleOperation, resource) {
  singleOperation.operationState = toTitleCase(singleOperation.operationState);
  singleOperation.lifecycleOperationType = toTitleCase(singleOperation.lifecycleOperationType);
  singleOperation.stateEnteredTime = formatDate(singleOperation.stateEnteredTime);
  singleOperation.operationStatusMessage = singleOperation.error;
  singleOperation.vnfInstanceName = resource.vnfInstanceName;
  singleOperation.instanceId = resource.instanceId;
  singleOperation.clusterName = resource.clusterName;
  return singleOperation;
}

export function mapOperationsData(operations) {
  const operationsUpdated = operations.items.map(operation => {
    const singleOperation = {
      operationState: toTitleCase(operation.operationState),
      lifecycleOperationType: toTitleCase(operation.lifecycleOperationType),
      stateEnteredTime: formatDate(operation.stateEnteredTime),
      operationStatusMessage: operation.error,
      vnfInstanceName: operation.vnfInstanceName,
      vnfInstanceId: operation.vnfInstanceId,
      clusterName: operation.clusterName,
      username: operation.username
    };
    return Object.assign({}, operation, singleOperation);
  });
  Object.assign(operations.items, operationsUpdated);
  return operations;
}

// TODO need more elegant solution.
export function removeExtension(value) {
  const lastIndex = value.lastIndexOf(".");
  if (lastIndex === -1) {
    return value;
  }
  return value.substring(0, lastIndex);
}

export function returnExtension(value) {
  const lastIndex = value.lastIndexOf(".");
  if (lastIndex !== -1) {
    return value.substring(lastIndex + 1);
  }
  return "";
}

export function formatBackendClustersData(clusters) {
  return clusters.map(cluster => {
    const clusterUpdated = {
      name: removeExtension(cluster.name),
      status: cluster.status === CLUSTER_USAGE_STATE_IN_USE ? IN_USE : NOT_IN_USE,
      isDefault: cluster.isDefault === true ? "Yes" : "No"
    };
    return Object.assign({}, cluster, clusterUpdated);
  });
}

export function renderTerminateDialog(terminateData, eventHandleObject) {
  const dialog = new DialogModel(
    "Confirm Termination",
    TERMINATION_CONFIRMATION_MESSAGE_SINGLE.replace("<RESOURCE>", terminateData.vnfInstanceName)
  );
  dialog.setNextParagraph(TERMINATION_CONFIRMATION_MESSAGE_CONTINUE);
  const buttons = [CANCEL_BUTTON, TERMINATE_BUTTON];
  dialog.setButtonLabels(buttons);
  dialog.setWarningButtonIndex(1);
  return html`
    <e-terminate-dialog
      .data=${terminateData}
      @dialog-button-click=${eventHandleObject}
      .dialogModel=${dialog}
    ></e-terminate-dialog>
  `;
}

export function renderBackupToLocalDialog(scopesData, backupCallback, cancelBackupCallback) {
  return html`
    <e-backup-local-dialog
      .data=${scopesData}
      @create-backup=${backupCallback}
      @cancel-backup=${cancelBackupCallback}
    ></e-backup-local-dialog>
  `;
}

export function renderErrorDialog(label, message, buttonCallBack) {
  return html`
    <eui-base-v0-dialog label=${label} no-cancel="true" show="true">
      <div slot="content" class="no-scroll dialog__content">
        ${message}
      </div>
      <eui-base-v0-button slot="bottom" id="error-button" @click=${buttonCallBack}
        >Ok</eui-base-v0-button
      >
    </eui-base-v0-dialog>
  `;
}

export function accessDenied() {
  return html`
    <div style="padding-top: 10px;padding-left: 30px">
      <p>${FORBIDDEN_ERROR_MESSAGE}</p>
      <p>${FORBIDDEN_ERROR_DESCRIPTION_MESSAGE}</p>
    </div>
  `;
}

function checkValidRoles(userRoles) {
  return (
    userRoles &&
    !isEmpty(userRoles) &&
    (userRoles.includes(EVNFM_UI_ROLE) || userRoles.includes(EVNFM_SUPER_USER_ROLE))
  );
}

export function checkPermission(userInfo, resource) {
  const hasPermissions = userInfo && userInfo.permissions && !isEmpty(userInfo.permissions);
  if (hasPermissions) {
    return typeof resource === "undefined" ? true : userInfo.permissions[resource];
  }
  return hasPermissions;
}

export function checkPermissions(action, resource) {
  this.userInformation = this.storeConnect(["userInformation"]).userInformation;
  this.state.tokenId = this.userInformation.tokenId;
  if (checkValidRoles(this.userInformation.roles)) {
    this.isValidPermission = checkPermission(this.userInformation, resource);
    if (this.isValidPermission) {
      action.call(this);
    }
  }
}

export function mapAdditionalAttributes(attributes) {
  const parameters = [];
  if (attributes) {
    attributes.forEach(item => {
      let defaultValue = item.default;
      if (item.default == null) {
        defaultValue = "";
      }
      parameters.push({ parameter: item.metadata.chart_param, value: defaultValue });
    });
  }

  return parameters;
}

export function createErrorMessagesHtml(errorMessages) {
  const errorMessageHtml = [];
  errorMessages.forEach(error => {
    errorMessageHtml.push(
      html`
        <p>${error}</p>
      `
    );
  });
  return errorMessageHtml;
}

export function compareVersion(version1, version2) {
  if (version1 === version2) {
    return 0;
  }
  version1 = version1.split(".");
  version2 = version2.split(".");
  const len = Math.min(version1.length, version2.length);
  for (let i = 0; i < len; i += 1) {
    if (parseInt(version1[i], 10) > parseInt(version2[i], 10)) {
      return 1;
    }
    if (parseInt(version1[i], 10) < parseInt(version2[i], 10)) {
      return -1;
    }
  }
  if (version1.length > version2.length) {
    return 1;
  }
  if (version1.length < version2.length) {
    return -1;
  }
  return 0;
}

export function removeEmptyOrNullParams(currentAttributes, newAttributes) {
  const clonedAttributes = Object.assign(currentAttributes, newAttributes);
  if (clonedAttributes) {
    Object.keys(clonedAttributes).forEach(key => {
      const value = clonedAttributes[key];
      if (value === undefined || (!value && value.length === 0)) {
        delete clonedAttributes[key];
      }
    });
    return clonedAttributes;
  }
  return currentAttributes;
}

export function removeNullDeployableModules(attributes) {
  if (
    attributes.extensions !== undefined &&
    attributes.extensions.deployableModules !== undefined
  ) {
    Object.keys(attributes.extensions.deployableModules).forEach(key => {
      const value = attributes.extensions.deployableModules[key];
      if (value === null) {
        delete attributes.extensions.deployableModules[key];
      }
    });
  }
}

export function findAssociatedArtifacts(deployableModuleName, deployableModulesObject) {
  const deployableModuleData = deployableModulesObject.find(
    ({ name }) => name === deployableModuleName
  );
  return deployableModuleData ? deployableModuleData.associatedArtifacts : [];
}

export function compressJSONString(jsonStr) {
  const jsonObj = JSON.parse(jsonStr);
  return JSON.stringify(jsonObj);
}

export function isWizardFinishButtonEnabled() {
  const finishButton = querySelectorDeep("eui-base-v0-button#finish");
  return !finishButton.hasAttribute("disabled");
}

export function setWizardFinishButtonEnabled(isEnabled, lcmOperation) {
  const finishButton = querySelectorDeep("eui-base-v0-button#finish");
  if (isEnabled) {
    finishButton.removeAttribute("disabled");
    finishButton.innerHTML = lcmOperation;
  } else {
    finishButton.setAttribute("disabled", "");
  }
}

export function removeNavigationOfNextStepsInWizard() {
  const wizardLayout = this.shadowRoot.querySelector(`eui-layout-v0-wizard`);
  const steps = wizardLayout.shadowRoot.querySelectorAll(`eui-layout-v0-wizard-header-step`);
  let afterCurrent = false;
  steps.forEach(item => {
    if (afterCurrent) {
      item.removeAttribute("completed");
    }

    if (item.current) {
      afterCurrent = true;
    }
  });
}

export function checkIsInputMethodOfType(inputMethod, inputMethodType) {
  if (inputMethodType === INPUT_METHOD_ALL) {
    return inputMethod.length === 2 || inputMethod.length === 0;
  }
  return inputMethod.length === 1 && inputMethod[0] === inputMethodType;
}

/**
 * Returns true if value is an Object
 *
 * @param value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return typeof value === "object" && value !== null && value.constructor === Object;
}

/**
 * If value has type object or array will be converted to string
 *
 * @param value
 * @returns {*}
 */
export function convertValueToStringIfObject(value, isPassword) {
  if (isPassword) {
    return "********";
  }

  return isPlainObject(value) || Array.isArray(value) ? JSON.stringify(value) : value;
}

export const TABLE_SORTING_TYPES = {
  asc: "asc",
  dec: "desc"
};

/**
 * Update state for columns with specific context
 *
 * @private
 * @param {object} params: specific column with new information
 */
export function updateColumnState(params) {
  const { columns, updatedColumn, defaultColumnsState } = params;

  return columns.map(item =>
    item.attribute === updatedColumn.attribute
      ? updatedColumn
      : defaultColumnsState.find(defaultItem => defaultItem.attribute === item.attribute)
  );
}

export function generateSubtitleByPage(page) {
  const { totalElements, totalPages, size, number } = page;
  const lastNumber = totalPages === number ? totalElements : number * size;
  const firstNumber = number * size - size + 1;

  return totalElements === 0 ? "(0)" : `(${firstNumber} - ${lastNumber} of ${totalElements})`;
}

export function checkIsLastRowOnPage(page) {
  if (page.number === page.totalPages) {
    const emptyRowsOnLastPage = page.number * page.size - page.totalElements;

    return page.size - emptyRowsOnLastPage === 1;
  }

  return false;
}

export function isFileInputEmpty(fileInput) {
  return fileInput && fileInput.files.length === 0;
}

export function validateFileExtension(file, accept) {
  if (accept) {
    const allowedExtensions = accept.split(",").map(extension => extension.trim());
    const fileExtension = `.${returnExtension(file.name)}`;
    if (!allowedExtensions.includes(fileExtension)) {
      return false;
    }
  }
  return true;
}

export const SYNC_INTERVAL = 5000;
