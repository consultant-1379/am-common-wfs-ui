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
//Dialog Events
export const DIALOG_BUTTON_CLICK_EVENT = "dialog-button-click";
export const DIALOG_TERMINATE_EVENT = "display-terminate-dialog";
export const UPDATE_SELECTED_VERSION_DATA_EVENT = "update-selected-version-data";
export const UPDATE_INFRASTRUCTURE_DATA_EVENT = "update-infrastructure-data";
export const UPDATE_GENERAL_ATTRIBUTES_DATA_EVENT = "update-general-attributes-data";
export const UPDATE_ADDITIONAL_ATTRIBUTES_DATA_EVENT = "update-additional-attributes-data";
export const UPDATE_ADDITIONAL_ATTRIBUTES_FILE_EVENT = "update-additional-attributes-file";
export const UPDATE_ADDITIONAL_ATTRIBUTES_METHOD_EVENT = "update-additional-attributes-method";
export const ADDITIONAL_ATTRIBUTES_USE_FILE_EVENT = "additional-attributes-use-file";
export const EUI_WIZARD_CANCEL_EVENT = "eui-wizard:cancel";
export const EUI_WIZARD_FINISH_EVENT = "eui-wizard:finish";
export const WIZARD_VALIDATE_STEP_EVENT = "validate-step";
export const GO_TO_UPGRADE_WIZARD_EVENT = "go-to-upgrade-wizard";
export const UPDATE_SELECTED_PACKAGE_DATA_EVENT = "update-selected-package-data";
export const WIZARD_CHANGE_EVENT = "wizard-change";
export const DIALOG_REMOVE_IDENTIFIER_EVENT = "display-remove-identifier-dialog";
export const GO_TO_ADD_NODE_EVENT = "go-to-resource-add-node";
export const GO_TO_SCALE_RESOURCE_EVENT = "go-to-resource-scale-node";
export const CONFIRM_ADD_NODE_EVENT = "confirm-add-node-event";
export const DIALOG_DELETE_NODE_EVENT = "display-delete-node-dialog";
export const DELETE_PACKAGE_EVENT = "delete-package";
export const DIALOG_ROLLBACK_EVENT = "display-rollback-dialog";
export const GO_TO_HEAL_RESOURCE_EVENT = "go-to-resource-heal-node";
export const DIALOG_BACKUP_EVENT = "display-backup-local-dialog";
export const DIALOG_DELETE_BACKUP_EVENT = "display-backup-delete-dialog";
export const CREATE_BACKUP_EVENT = "create-backup";
export const CANCEL_BACKUP_EVENT = "cancel-backup";
export const UPDATE_VNFD_DATA = "update-vnfd-data";
export const DIALOG_EXPORT_BACKUP_EVENT = "display-export-backup-dialog";
export const CONFIRM_EXPORT_BACKUP_EVENT = "confirm-export-backup";
export const CANCEL_EXPORT_BACKUP_EVENT = "cancel-export-backup";
export const DELETE_BACKUP_EVENT = "delete-backup";
export const DEREGISTER_CLUSTER_EVENT = "display-deregister-cluster-dialog";
export const UPGRADE_CLUSTER_CONFIG_EVENT = "display-upgrade-cluster-config-dialog";
export const UPGRADE_DEFAULT_CLUSTER_CONFIG_EVENT = "display-upgrade-default-cluster-config-dialog";
export const ROLLBACK_OPERTION_EVENT = "display-rollback-operation-dialog";
export const ROLLBACK_EVENT = "rollback";
export const FAIL_OPERATION_EVENT = "display-fail-operation-dialog";
export const VIEW_MESSAGE_EVENT = "open-error-message-flyout";
export const REFRESH_OPERATIONS_DATA_EVENT = "refresh-data";
export const DIALOG_MODIFY_VNF_EVENT = "display-modify-vnf-dialog";
export const DIALOG_SYNC_EVENT = "dialog-sync:show";

// generic text field events
export const GENERIC_TEXT_FIELD_RESET_EVENT = "genericTextField:reset";

// key value pair events
export const GENERIC_KV_PAIR_INPUT_DELETE_EVENT = "genericKeyValuePairInput:delete";
export const GENERIC_KV_PAIR_FILE_TEXT_INPUT_CHANGE_EVENT = "genericKeyValueFileTextInput:change";
export const GENERIC_KV_PAIR_INPUT_CHANGE_EVENT = "genericKeyValuePairInput:change";
export const GENERIC_KV_PAIR_INPUT_GROUP_CHANGE_EVENT = "genericKeyValuePairInputGroup:change";

// key map card events
export const GENERIC_KEY_MAP_CARD_CHANGE_EVENT = "genericKeyMapCard:change";
export const GENERIC_KEY_MAP_CARD_DELETE_EVENT = "genericKeyMapCard:delete";
export const GENERIC_KEY_MAP_CARD_GROUP_CHANGE_EVENT = "genericKeyMapCardGroup:change";

// common events
export const INPUT = "input";
