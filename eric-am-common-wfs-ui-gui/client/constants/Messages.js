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
//App page names
export const RESOURCES_PAGE = "Resources";
export const RESOURCE_DETAILS_PAGE_BACKUPS_TAB = "Backups";
export const ALL_PAGES = "all";
export const PACKAGES_PAGE = "Packages";
export const OPERATIONS_PAGE = "Operations";
export const RESOURCE_DETAILS_OPERATIONS_PAGE = "Details Operations";
export const ONBOARDED_PACKAGES = "Onboarded Packages";
export const VERSIONS_OF_PACKAGE = "Versions of package <Package>"; // Upgrade Wizard Packages Table
export const CISM_CLUSTERS_PAGE = "CISM Clusters";

//Nothing Selected
export const NO_RESOURCE_SELECTED = "No resource selected";
export const NO_PACKAGE_SELECTED = "No package selected";
export const NO_OPERATION_SELECTED = "No operation selected";
export const NO_CLUSTER_SELECTED = "No cluster selected";

//Nothing found
export const NO_RESOURCES_FOUND = "No resources found";
export const NO_BACKUPS_FOUND = "No backups found";
export const NO_PACKAGES_FOUND = "No packages found";
export const NO_OPERATIONS_FOUND = "No operations found";
export const NO_CISM_CLUSTERS_FOUND = "No CISM clusters found";

//Context Menu
export const GO_TO_DETAILS = "Go to details page";
export const INSTANTIATE = "Instantiate";
export const TERMINATE = "Terminate";
export const CLEAN_UP = "Clean up";
export const UPGRADE = "Upgrade";
export const SCALE = "Scale";
export const ADD_NODE = "Add node to ENM";
export const DELETE_NODE = "Delete node from ENM";
export const DELETE_PACKAGE = "Delete package";
export const ROLLBACK = "Rollback";
export const HEAL = "Heal";
export const BACKUP = "Backup";
export const DELETE_BACKUP = "Delete";
export const EXPORT_BACKUP = "Export to external location";
export const DEREGISTER_CLUSTER = "Deregister cluster";
export const UPGRADE_CLUSTER_CONFIG = "Update cluster config";
export const UPGRADE_DEFAULT_CLUSTER_CONFIG = "Make default";
export const ROLLBACK_OPERATION = "Rollback";
export const FAIL_OPERATION = "Force fail";
export const ERROR_MESSAGE = "View error message";
export const MODIFY_VNF_INFO = "Modify VNF Information";
export const SYNC = "Sync";


//Package Onboarding
export const CANCEL_PACKAGE_ONBOARD = "Package onboard has been canceled";
export const FAILED_PACKAGE_ONBOARD = "Package onboard has failed";
export const COMPLETED_PACKAGE_ONBOARD = "Package onboard request has been accepted";
export const COMPLETED_PACKAGE_ONBOARD_MESSAGE =
  "This may take some time to process and view on screen.";
export const FAILED_DELETE_PACKAGE = "Package failed to delete";
export const COMPLETED_DELETE_PACKAGE = "Package has been deleted";
export const COMPLETED_DELETE_PACKAGE_MESSAGE = "Be aware of some objects, such as image layers, in container registry might remain. See Delete VNF Package chapter in EVNFM User’s Guide for details.";
export const WARNING_TOOLTIP_OPERATION_ERROR = "One or more operations contain errors";

//Backup
export const FAILED_DELETE_BACKUP = "Delete backup has failed";
export const FAILED_FETCH_BACKUP_INFO = "Failed to fetch backup information";
export const FAILED_CREATE_BACKUP = "Backup resource has failed";
export const DELETE_BACKUP_CONFIRMATION =
  "The backup [:backupName] will be permanently deleted.";
export const DELETE_BACKUP_CONFIRMATION_SUB_CONTENT = "Do you want to continue?";
export const REQUEST_BRO_SUCCESS_NOTIFICATION_MESSAGE = "Request to BRO was successful";

//User Administration
export const USER_ADMINISTRATION = "User Administration";

export const INVALID_TIMEOUT_ERR_MSG = "Invalid Timeout";

export const MISSING_PASSWORD_ERR_MSG = "Restore password should be specified";

export const CLUSTER_DESCRIPTION_INSTANTIATE =
  "Configuration file name for cluster to which resource will be deployed.";

export const NAMESPACE_DESCRIPTION_INSTANTIATE =
  "Namespace to which the resource will be deployed in. If the namespace does not exist the request will first create the namespace and then proceed with the lifecycle operation.";

export const CLUSTER_DESCRIPTION_UPGRADE =
  "Configuration file name for cluster to which resource will be deployed.";

export const NAMESPACE_DESCRIPTION_UPGRADE = "Namespace to which the resource will be deployed in.";

export const SKIP_JOB_VERIFICATION = "Skip job verification";

export const SKIP_JOB_VERIFICATION_DESC =
  "Bypass verification of Pods created as part of Job";

export const HELM_NO_HOOKS = "Skip helm hooks";
export const HELM_NO_HOOKS_DESC = "If set, adds no hooks to the helm command";

export const SKIP_MERGING_PREVIOUS_VALUES = "Skip merging previous values";
export const SKIP_MERGING_PREVIOUS_VALUES_DESC = "If set, skip merging of previous values";

export const MANUAL_CONTROL_SCALING = "Controlled by Scale VNF requests";
export const MANUAL_CONTROL_SCALING_DESC = "If set, scaling is handled by EVNFM controlling the HPA through Scale VNF requests rather than the Horizontal Pod Autoscaler (HPA)";

export const DISABLE_K8S_OPENAPI_VALIDATION = "Disable Validation";

export const PERSIST_SCALE_INFO_DESC = "Persists the scale information from previous state.";
export const PERSIST_DM_CONFIGURATION = "Persist Deployable Modules configuration from previous state"

//Dialog Buttons
export const CANCEL_BUTTON = "Cancel";
export const FORCE_FAIL_BUTTON = "Force fail";
export const INSTANTIATE_NEW_BUTTON = "Instantiate new";
export const NO_PACKAGE_ONBOARDED = "Unavailable as no packages onboarded";
export const TERMINATE_BUTTON = "Terminate";
export const CLEAN_UP_BUTTON = "Clean up";
export const SYNC_BUTTON = "Sync";
export const DELETE_NODE_BUTTON = "Delete node";
export const ONBOARD_PACKAGE_BUTTON = "Onboard package";
export const DELETE_PACKAGE_BUTTON = "Delete package";
export const ROLLBACK_BUTTON = "Rollback";
export const DELETE_BUTTON = "Delete";
export const REGISTER_CLUSTER_BUTTON = "Register cluster";
export const REGISTER_CLUSTER_UPLOAD_BUTTON = "Upload";
export const DEREGISTER_CLUSTER_BUTTON = "Deregister";
export const MODIFY_VNF_INFO_BUTTON = "Modify";
export const OK_BUTTON = "OK";

//Instantiate & Upgrade Dialog
export const SEE_RESOURCE_LIST_BUTTON = "See Resource list";
export const SEE_OPERATION_LIST_BUTTON = "See Operation list";

//Instantiate Dialog
export const INSTANTIATE_OPERATION_STARTED = "Instantiate operation started";
export const INSTANTIATE_FAILED = "Instantiate operation has failed";
export const VNF_IDENTIFIER_FAILED = "VNF Identifier operation has failed";
export const INSTANTIATE_MESSAGE = "<RESOURCE> is being instantiated";

//Upgrade Dialog
export const UPGRADE_OPERATION_STARTED = "Upgrade operation started";
export const UPGRADE_FAILED = "Upgrade operation has failed";
export const UPGRADE_MESSAGE = "<RESOURCE> is being upgraded";

//Scale Dialog
export const SCALE_OPERATION_STARTED = "Scale operation started";
export const SCALE_FAILED = "Scale operation has failed";
export const SCALE_MESSAGE = "<RESOURCE> is being scaled";

//Rollback Dialog
export const ROLLBACK_FAILED = "Rollback operation has failed";

//Sync Dialog
export const SYNC_TIMEOUT_LABEL = "Timeout (sec)";
export const SYNC_SUCCESS_MSG_TITLE = "Sync started";
export const SYNC_SUCCESS_MSG_DESC = "<RESOURCE> is being synchronized";

//Operations
export const OPERATIONS_FETCH_FAILED = "Failed to fetch operation(s)";

//Clusters
export const CLUSTERS_FETCH_FAILED = "Failed to fetch cluster(s)";
export const CLUSTER_REGISTER_FAILED = "Cluster failed to register";
export const CLUSTER_DEREGISTER_FAILED = "Cluster failed to deregister";

//Resources
export const RESOURCES_FETCH_FAILED = "Failed to fetch resource(s)";
export const COMPONENTS_FETCH_FAILED = "Failed to fetch components for resource instance";
export const WIZARD_FILE_UPLOAD_DESC =
  "Values present in the UI shall override any values defined in the YAML file, this includes any default values that were automatically populated into the UI from the VNF descriptor. When only the 'Upload values file' is selected, any inputs added in the UI will be ignored.";

//Packages
export const PACKAGES_FETCH_FAILED = "Failed to fetch package(s)";

//Packages Dialog
export const TERMINATION_PACKAGE_MESSAGE = "You are about to delete '<PACKAGE>'.";

//Termination Dialog
export const TERMINATION_CONFIRMATION_MESSAGE_SINGLE = "You are about to terminate '<RESOURCE>'.";

export const TERMINATION_CONFIRMATION_MESSAGE_CONTINUE =
  "This will completely delete your resource, its components and operation history without the ability to \n" +
  "" +
  "restore them. Related networks will be disrupted. Optional terminate resource values listed below.";

export const CLEAN_UP_CONFIRMATION_MESSAGE_SINGLE =
  "This will remove the resource instance entry from the database. If the resource instance has remaining artefacts from the deployment then they" +
  " will also be removed.";

export const FORCE_FAIL_CONFIRMATION_MESSAGE_SINGLE =
  "The upgrade operation will be failed. This action cannot be reversed."

export const DELETE_NODE_CONFIRMATION_MESSAGE = "You are about to delete '<RESOURCE>' from ENM.";

export const DEREGISTRATE_CLUSTER_CONFIRMATION_MESSAGE =
  "<CLUSTER_NAME> will be deregistered, do you want to proceed?";

export const ROLLBACK_CONFIRMATION_MESSAGE = "You are about to perform a rollback on '<RESOURCE>'";
export const ROLLBACK_WARNING_MESSAGE = "This action cannot be reversed, do you want to continue?";

export const SKIP_VERIFICATION = "Skip application verification";
export const PERSIST_SCALE_INFO = "Persist Scale Info";
export const CLEAN_UP_RESOURCES = "Clean up resources";
export const APPLICATION_TIMEOUT = "Application timeout (sec)";
export const SKIP_VERIFICATION_DESCRIPTION = "Bypass application verification checks";
export const CLEAN_UP_RESOURCES_DESCRIPTION =
  "Removes the resources on the cluster associated with the application, including the Persistent Volume Claims and Persistent Volumes";
export const APPLICATION_TIMEOUT_DESCRIPTION =
  "Maximum time allocated for application to <OPERATION>";
export const CURRENT_VERSION = "Current package version";
export const ROLLBACK_VERSION = "Rollback package version";

// Add Node Page
export const ADD_NODE_CONFIRMATION_MESSAGE = "You are about to add '<RESOURCE>' to ENM.";
export const ADD_NODE_BUTTON = "Add node";
export const ADD_NODE_SUCCESS_MESSAGE = "<RESOURCE> has been successfully added to ENM.";
export const ADD_NODE_OPERATION_STARTED = "Add node operation started";
export const ADD_NODE_MESSAGE = "<RESOURCE> is being added to ENM.";

// Scale Resource Page
export const SCALE_STARTED_NOTIFICATION = "Scale operation has started";

//Notification messages
//TERMINATION_STARTED_NOTIFICATION to be replaced with OPERATION_STARTED_MESSAGE when the operations page is delivered
export const TERMINATION_STARTED_NOTIFICATION = "Terminate operation has started";
export const TERMINATION_FAILED = "Terminate operation has failed";
export const OPERATION_STARTED_MESSAGE =
  "To see progress in Operation list click this notification";

export const FAIL_OPERATION_MESSAGE =
  "Operation has been updated to failed";

export const FILE_UPLOAD_ERROR = 'File type "<FILETYPE>" is not supported, only yaml or yml.';

export const DELETE_NODE_SUCCESS_MESSAGE = "Node has been removed from ENM succesfully";

export const WIZARD_FILE_UPLOAD_FAILED_ERROR_HEADER = "File type not supported";
export const WIZARD_FILE_UPLOAD_FAILED_ERROR_BODY = "Only yaml or yml";

export const GENERIC_ERROR_MESSAGE = "Internal Error";
export const GENERIC_ERROR_DESCRIPTION_MESSAGE = "No response provided for request";

export const FORBIDDEN_ERROR_MESSAGE = "Access denied";
export const FORBIDDEN_ERROR_DESCRIPTION_MESSAGE =
  "Your role does not allow you access to perform this action. Contact your System Administrator to change your access rights.";

export const WRONG_COMPLEX_TYPE_VALUES =
  'Values do not comply with defined entry_schema type "<TYPE>"';
export const WRONG_COMPLEX_TYPE = 'Values do not comply with defined type "<TYPE>"';

export const ONBOARDING_SERVICE_UNAVAILABLE = "CVNFM Onboarding service temporarily unavailable";

export const FILE_CONFIG_UPLOAD_ERROR_INVALID_TYPE = `File type <FILETYPE> not supported, only ".config" files are supported.`;
export const FILE_CONFIG_UPLOAD_ERROR_NO_TYPE = `File is not supported, only ".config" files are supported.`;

//Heal
export const HEAL_NO_CAUSES_MSG =
  "Resource cannot be healed as there are no heal causes defined in descriptor file of the package";
export const HEAL_CONFIRMATION_MESSAGE = "This action cannot be reversed, do you want to continue?";
export const HEAL_STARTED_NOTIFICATION = "Heal operation has started";

//Backup
export const BACKUP_NAME_LENGTH = "Maximum backup name length is 250";
export const BACKUP_NAME_EMPTY = "Backup name cannot be empty";
export const BACKUP_NAME_INVALID_CHAR = "Invalid character(s) in backup name";

//Rollback
export const ROLLBACK_STARTED_NOTIFICATION = "Rollback operation has started";
export const ROLLBACK_PARAMS_MESSAGE = "Additional parameters will only be used in the rollback pattern for install or upgrade operations.";

//CRD
export const INVALID_CRD_NAMESPACE =
  "Kubernetes reserved namespace: <NAMESPACE> cannot be used as a CRD namespace.";
export const INVALID_NAMESPACE_PATTERN =
  "Namespace must not be longer than 63 characters. Must consist of lower case alphanumeric characters or '-' (e.g. 'my-name',  or '123-abc').";

// Key Value File Text Input
export const VALUE_EMPTY_ERROR_MESSAGE = "Value cannot be empty";
export const INVALID_FILE_EXTENSION_ERROR_MESSAGE = "File extension is not supported";
export const INVALID_JSON_FORMAT_ERROR_MESSAGE = "File contains invalid JSON format";

// Key Value Pair Input
export const KEY_EMPTY_ERROR_MESSAGE = "Key cannot be empty";
export const KEY_ALREADY_EXISTS_ERROR_MESSAGE = "Key is duplicated";
export const AT_LEAST_ONE_KV_PAIR_ERROR_MESSAGE = "At least one key/value pair is required";

//Modify VNF INFO
export const MODIFY_VNF_INFO_MESSAGE = "Modify VNF Information for '<RESOURCE>'";

// Supported operation tab
export const ERROR_INFORMATION = "View error information";
export const SUPPORTED_OPERATION = "Supported";
export const UNSUPPORTED_OPERATION = "Not supported";
