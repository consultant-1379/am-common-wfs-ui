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
//VNFD interface definitions for VNF lifecycles
export const VNFLCM_INTERFACES_INSTANTIATE = "instantiate";
export const VNFLCM_INTERFACES_UPGRADE = "change_package";
export const VNFLCM_INTERFACES_UPGRADE_V1_3 = "change_current_package";

//EVNFM UI APP marker for VNF lifecycles
export const LCM_OPERATION_INSTANTIATE = "Instantiate";
export const LCM_OPERATION_UPGRADE = "Upgrade";

//EVNFM packages JSON fields that require transformations before being shown
export const PACKAGES_USAGE_STATE_NOT_IN_USE = "NOT_IN_USE";

//Query ID Parameter Names
export const PACKAGE_PARAM_NAME = "packageId";
export const RESOURCE_PARAM_NAME = "resourceId";

export const INSTANTIATED = "INSTANTIATED";
export const NOT_INSTANTIATED = "NOT_INSTANTIATED";

//Resources Names
export const INSTANTIATE_RESOURCE_NAME = "E-VNFM Resource Instantiation Resource";
export const UPGRADE_RESOURCE_NAME = "E-VNFM Resource Upgrade Resource";
export const SCALE_RESOURCE_NAME = "E-VNFM Manual Scale Resource";
export const TERMINATE_RESOURCE_NAME = "E-VNFM Resource Termination Resource";
export const RESOURCE_RESOURCE_NAME = "E-VNFM Resource Resource";
export const ADD_NODE_RESOURCE_NAME = "E-VNFM ENM Node Integration Resource";
export const DELETE_NODE_RESOURCE_NAME = "E-VNFM ENM Node Deletion Resource";
export const PACKAGES_RESOURCE_NAME = "E-VNFM Packages Resource";
export const PACKAGE_RESOURCE_NAME = "E-VNFM Package Resource";
export const PACKAGES_ONBOARDING_RESOURCE_NAME = "E-VNFM Package Onboarding Resource";
export const ROLLBACK_RESOURCE_NAME = "E-VNFM Resource DowngradeInfo Resource";
export const BACKUP_RESOURCE_NAME = "E-VNFM Backup Resource";
export const HEAL_RESOURCE_NAME = "E-VNFM Manual Heal Resource";
export const CLUSTER_RESOURCE_NAME = "E-VNFM Cluster Configuration Resource";
export const ROLLBACK_OPERATION_RESOURCE_NAME = "E-VNFM Manual Rollback Operation";
export const FAIL_OPERATION_RESOURCE_NAME = "E-VNFM Manual Fail Operation";
export const SYNC_RESOURCE_NAME = "E-VNFM Syncronize Resource";

// Roles
export const EVNFM_UI_ROLE = "E-VNFM UI User Role";
export const EVNFM_SUPER_USER_ROLE = "E-VNFM Super User Role";

//Resources
export const RESOURCES_BASE_QUERY = "(eq,lcmOperationDetails/currentLifecycleOperation,true)";
export const RESOURCES_DETAILS_URI = "#resource-details?id=";

//Packages
export const PACKAGES_BASE_QUERY = "(eq,packages/onboardingState,ONBOARDED)";
export const PACKAGES_DETAILS_URI = "#package-details?id=";

// Additional attributes input
export const INPUT_METHOD_FILE = "input_method_file";
export const INPUT_METHOD_EDIT = "input_method_edit";
export const INPUT_METHOD_ALL = "input_method_all";

//EVNFM clusters JSON fields that require transformations before being shown
export const CLUSTER_USAGE_STATE_IN_USE = "IN_USE";

// Usage States
export const IN_USE = "In use";
export const NOT_IN_USE = "Not in use";

//CRD charts
export const DEFAULT_CRD_NAMESPACE = "eric-crd-ns";
export const CRD_NAMESPACE_PATTERN = "^[-a-z0-9]{0,63}$";
export const KUBE_RESERVED_NAMESPACES = [
  "default",
  "kube-system",
  "kube-public",
  "kube-node-lease"
];

// Secret
export const SECRET_ATTRIBUTES = "Secret attributes";
export const SECRET_NAME = "Secret name";
export const ADD_SECRET = "Add secret";

// Tosca definitions version
export const TOSCA_DEFINITIONS_VERSIONS = Object.freeze({
  "1.2": "tosca_simple_yaml_1_2",
  "1.3": "tosca_simple_yaml_1_3"
});
