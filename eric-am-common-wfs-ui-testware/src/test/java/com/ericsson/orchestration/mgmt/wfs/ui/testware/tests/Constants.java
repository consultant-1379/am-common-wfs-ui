/*******************************************************************************
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
 ******************************************************************************/
package com.ericsson.orchestration.mgmt.wfs.ui.testware.tests;

class Constants {

    static final String RESOURCES = "Resources";
    static final String PACKAGES = "Packages";
    static final String OPERATIONS = "Operations";
    static final String CISM_CLUSTERS = "CISM Clusters";
    static final String USER_ADMINISTRATION = "User Administration";
    static final String RESOURCES_TABLE_ID = "resourcesTable";
    static final String PACKAGE_TABLE_ID = "packagesTable";
    static final String CLUSTERS_TABLE_ID = "clustersTable";
    static final String OPERATIONS_TABLE_ID = "operationsTable";
    static final String TABLE_ROW_SELECTOR = " tbody tr:nth-child(";
    static final String NO_PACKAGE_SELECTED = "No package selected";
    static final String GO_TO_DETAILS = "Go to details page";
    static final String GO_TO_DETAILS_PAGE = "Go-to-details-page";
    static final String FORCE_FAIL = "Force-fail";
    static final String VIEW_ERROR_MESSAGE = "View-error-message";
    static final String INSTANTIATE = "Instantiate";
    static final String DELETE_PACKAGE = "Delete-package";
    static final String DELETE_SPACE_PACKAGE = "Delete package";
    static final String UPGRADE = "Upgrade";
    static final String TERMINATE = "Terminate";
    static final String SCALE = "Scale";
    static final String HEAL = "Heal";
    static final String ADD_NODE = "Add-node-to-ENM";
    static final String CLEAN_UP = "Clean-up";
    static final String DELETE_NODE = "Delete-node-from-ENM";
    static final String MODIFY_VNF_INFO = "Modify-VNF-Information";
    static final String SYNC = "Sync";
    static final String ROLLBACK = "Rollback";
    static final String SGSN_PACKAGE_NAME = "Ericsson.SGSN-MME.1.20 (CXS101289_R81E08).cxp9025898_4r81e08";
    static final String VMME_PACKAGE_NAME = "Ericsson.vMME.0.40 (CXS101289_R81E09).cxp9025899";
    static final String USAGE_STATE_TRUE = "In use";
    static final String USAGE_STATE_FALSE = "Not in use";
    static final String FLYOUT_CONTEXT_MENU_ID = "multipanel-flyout-context-menu";
    static final String RESOURCE_1_ID = "test-instance__dummy";
    static final String RESOURCE_1_ID_FAILED = "test-instance-failed__dummy";
    static final String RESOURCE_2_ID = "test-instance-1__dummy";
    static final String RESOURCE_2_ID_FAILED = "test-instance-1-failed__dummy";
    static final String RESOURCE_3_ID = "test-instance-2__dummy";
    static final String RESOURCE_4_ID = "downgrade-test-valid__dummy";
    static final String RESOURCE_5_ID = "downgrade-test-package-deleted__dummy";
    static final String RESOURCE_6_ID = "test-instance-6-no-heal__dummy";
    static final String RESOURCE_7_ID = "test-instance-7__dummy";
    static final String RESOURCE_8_ID = "test-instance-8__dummy";
    static final String OPERATIONS_8_ID = "instance-8__cluster-8";
    static final String PACKAGE_1_ID = "d3def1ce-4cf4-477c-aab3-21cb04e6a380";
    static final String PACKAGE_2_ID = "d3def1ce-4cf4-477c-aab3-21cb04e6a386";
    static final String ADDITIONAL_ATTRIBUTES_SELECTOR = "#additionalAttributes";
    static final String BACKUPS_TAB_SELECTOR = "eui-layout-v0-tabs > eui-layout-v0-tab:nth-child(5)";
    static final String NEXT_BUTTON = "#next";
    static final String FINISH_BUTTON = "#finish";
    static final String PREVIOUS_BUTTON = "#previous";
    static final String SEE_RESOURCE_LIST_BUTTON_SELECTOR = "eui-base-v0-button[slot=\"bottom\"]";
    static final String LIST_TYPE_ADD_ATTRIBUTE_SELECTOR = "#listType";
    static final String LIST_OF_LISTS_ADD_ATTRIBUTE_SELECTOR = "#listTypeOfList";
    static final String LIST_OF_MAPS_ADD_ATTRIBUTE_SELECTOR = "#listTypeOfMap";
    static final String MAP_TYPE_ADD_ATTRIBUTE_SELECTOR = "#mapType";
    static final String MAP_OF_LISTS_ADD_ATTRIBUTE_SELECTOR = "#mapTypeOfList";
    static final String MAP_OF_MAPS_ADD_ATTRIBUTE_SELECTOR = "#mapTypeOfMap";
    static final String VALUES_YAML_SELECTOR = "values.yaml";
    static final String EXTEND_ADDITIONAL_ATTRIBUTES_SELECTOR = "div.accordion-title";
    static final String VALUE = "value";

    static final String NAME = "name";
    static final String ERICSSON123 = "Ericsson123!";
    static final String COMPLETED_DELETE_PACKAGE = "Package has been deleted";
    static final String RESOURCES_URL_PART = "#resources";
    static final String OPERATIONS_URL_PART = "#operations";
    static final String RESOURCE_DETAILS_URL_PART = "#resource-details";
    static final String PACKAGES_URL_PART = "#packages";
    static final String CLUSTERS_URL_PART = "#clusters";
    static final String VALID_LIST_VALUE = "[\"test1\",\"test2\"]";
    static final String INVALID_MAP_VALUE = "[\"key1\":\"value1\",\"key2\":\"value2\"]";
    static final String VALID_MAP_VALUE = "{\"key1\":\"value1\",\"key2\":\"value2\"}";
    static final String INCORRECT_LIST_VALUE = "[true,false]";
    static final String INCORRECT_MAP_VALUE = "{\"key1\":true,\"key2\":false}";
    static final String INVALID_LIST_VALUE = "{\"test1\",\"test2\"}";
    static final String INVALID_VALUES_YAML = "testKey:testValue";
    static final String INVALID_JSON_ERROR_TEXT = "Invalid JSON";
    static final String NOT_LIST_TYPE_ERROR_TEXT = "Values do not comply with defined type \"list\"";
    static final String NOT_MAP_TYPE_ERROR_TEXT = "Values do not comply with defined type \"map\"";
    static final String ENTRY_SCHEMA_ERROR_TEXT = "Values do not comply with defined entry_schema type \"string\"";
    static final String VALID_LIST_OF_LISTS_VALUE = "[[\"test1\",\"test2\"],[\"test3\",\"test4\"]]";
    static final String VALID_LIST_OF_MAPS_VALUE = "[{\"key1\":\"value1\",\"key2\":\"value2\"},{\"key3\":\"value3\",\"key4\":\"value4\"}]";
    static final String VALID_MAP_OF_LISTS_VALUE = "{\"key1\":[\"value11\",\"value12\"],\"key2\":[\"value21\",\"value22\"]}";
    static final String VALID_MAP_OF_MAPS_VALUE = "{\"key1\":{\"key11\":\"value11\",\"key12\":\"value12\"},\"key2\":{\"key21\":\"value21\",\"key22\":\"value22\"}}";
    static final String VALID_VALUES_YAML = "{\"testKey\":\"testValue\"}";
    static final String CUSTOM_CELL = ".custom-table__cell #";
    static final String RESOURCE_1_CONTEXT_MENU_SELECTOR = CUSTOM_CELL + RESOURCE_1_ID;
    static final String RESOURCE_2_CONTEXT_MENU_SELECTOR = CUSTOM_CELL + RESOURCE_2_ID;
    static final String RESOURCE_2_FAILED_CONTEXT_MENU_SELECTOR = CUSTOM_CELL + RESOURCE_2_ID_FAILED;
    static final String RESOURCE_7_CONTEXT_MENU_SELECTOR = CUSTOM_CELL + RESOURCE_7_ID;
    static final String RESOURCE_1_FAILED_CONTEXT_MENU_SELECTOR = CUSTOM_CELL + RESOURCE_1_ID_FAILED;

    //Backups
    static final String COMPLETE_BACKUP_ID = "cnf-backup_3.2.0_20210120155030";
    static final String INCOMPLETE_BACKUP_ID = "cnf-backup_3.2.0_20210120175030";
    static final String CORRUPTED_BACKUP_ID = "cnf-backup_3.2.0_20210120165030";
    static final String BACKUP_MENU_SELECTOR = "div[class=custom-table__cell_value][title=\"%s\"]+e-context-menu[class=custom"
            + "-table__cell_context_menu]";
    static final String NAME_SELECTOR = "div.custom-table__cell_value a";

    // Instantiate Wizard
    public static final String PACKAGE_CONTEXT_MENU_SELECTOR = ".custom-table__cell #row-d3def1ce-4cf4-477c-aab3-21cb04e6a386";
    public static final String NAMESPACE_FIELD_SELECTOR = "Namespace";
    public static final String RESOURCE_INSTANCE_NAME_FIELD_SELECTOR = "Resource instance name";
    public static final String GENERAL_ATTRIBUTES_SELECTOR = "#generalAttributes";
    public static final String INSTANTIATE_OPERATION_STARTED_DIALOG_SELECTOR = "div[class=\"dialog__title\"]";
    public static final String PERSIST_SCALE_INFO_CHECKBOX_SELECTOR = "#persistScaleInfo";
    public static final String SKIP_MERGING_PREVIOUS_VALUES_SELECTOR = "#skipMergingPreviousValues";
    public static final String CLUSTER_SUMMARY_INFO_SELECTOR = "div[class=\"summary-key\"][title=\"Cluster\"] + div.summary-value";
    public static final String NAMESPACE = "my-name-space";
    public static final String RESOURCE_NAME_TOO_LONG_TEXT = "this-is-a-sentence-that-is-longer-than-50-characters";
    public static final String ERROR_TEXT_TOO_LONG_RESOURCE_NAME = "Resource instance name must not be longer than 50 characters.";
    public static final String RESOURCE_NAME_VALID_TEXT = "acceptable-input";
    public static final String INSTANTIATE_OPERATION_STARTED_DIALOG_TEXT = "Instantiate operation started";
    public static final String DEFAULT_CLUSTER = "default";
    public static final String EXTERNAL_CLUSTER = "cluster1";
    public static final String GENERAL_ATTRIBUTES = "General attributes";
    public static final String WIZARD_STEP_SELECTED_TITLE = "eui-layout-v0-wizard-step[selected] .title";
    public static final String INFRASTRUCTURE = "Infrastructure";
    public static final String PACKAGE_SELECTION = "Package selection";
    public static final String ADDITIONAL_ATTRIBUTES = "Additional attributes";
    public static final String SUMMARY = "Summary";
    public static final String CLUSTER = "Cluster";
    public static final String INFRASTRUCTURE_FIELDS_SELECTOR = ".infrastructureFields";
    public static final String INSTANTIATION_LEVEL_ID = "instantiation_level_2";
    public static final String INSTANTIATION_LEVEL_DROPDOWN = "e-generic-dropdown#instantiation-level-id";

    public static final String INSTANTIATION_SCALE_LEVEL_SELECTOR = "eui-base-v0-radio-button#manualScaleLevel";

    public static final String DYNAMIC_SCALE_LEVEL_SELECTOR = "eui-base-v0-radio-button#dynamicScaleLevel";

    public static final String INSTANTIATION_LEVEL_DROPDOWN_SELECTED = ".dropdown > eui-base-v0-button";
    public static final String INSTANTIATION_LEVEL_DROPDOWN_MENU_SELECTOR = "e-generic-dropdown#instantiation-level-id eui-base-v0-radio-button";

    public static final String ASPECT_PAYLOAD_2_MANUAL_CONTROLLED_ID = "#extension-vnfControlledScaling-ManualControlled-Payload_2";
    public static final String ASPECT_PAYLOAD_2_CISM_CONTROLLED_ID = "#extension-vnfControlledScaling-CISMControlled-Payload_2";


    public static final String ASPECT1_MANUAL_CONTROLLED_ID = "#extension-vnfControlledScaling-ManualControlled-Aspect1";
    public static final String ASPECT1_CISM_CONTROLLED_ID = "#extension-vnfControlledScaling-CISMControlled-Aspect1";


    // Pagination
    public static final String PAGINATION_SELECTOR = "eui-pagination-v0";
    public static final String PAGINATION_CURRENT_PAGE = "current-page";
    public static final String PAGINATION_NUM_PAGES = "num-pages";
    public static final String TABLE_SELECTOR = "e-generic-table#";
    static final String DESCRIPTION_PLACEHOLDER_SELECTOR = "textarea#item.input.textarea";

    // Multi secrets
    public static final String EMPTY_KEY_AND_VALUE_TEXTFIELD = "At least one key/value pair is required";
    public static final String EMPTY_VALUE_WARNING = "Value cannot be empty";
    public static final String EMPTY_KEY_WARNING = "Key cannot be empty";
    public static final String UNSUPPORTED_FILE_TYPE = "File extension is not supported";
    public static final String INVALID_JSON_FORMAT = "File contains invalid JSON format";
    public static final String DUPLICATE_SECRET_NAME_ERROR = "Secret name is duplicated";
    public static final String DUPLICATE_KEY_ERROR = "Key is duplicated";

    // Multi secrets - selectors
    public static final String MULTI_SECRET_CARD_GROUP_SELECTOR = "e-generic-key-map-card-group[name=\"day0.configuration.secrets\"]";
    public static final String MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " eui-base-v0-button#addCardBtn";
    public static final String MULTI_SECRET_CARDS_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " e-generic-key-map-card.card";
    public static final String MULTI_SECRET_DELETE_CARD_BUTTON_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " eui-base-v0-tooltip#deleteCardIcon";
    public static final String MULTI_SECRET_CARD_ADD_KV_PAIR_BUTTON_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " eui-base-v0-button"
            + "#addKeyValuePairBtn";
    public static final String MULTI_SECRET_CARD_WARNING_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " eui-base-v0-tooltip#warningTooltip";
    public static final String MULTI_SECRET_SECRET_NAME_TEXTFIELD = MULTI_SECRET_CARD_GROUP_SELECTOR + " #keyTextField";
    public static final String MULTI_SECRET_SECRET_NAME_ERROR_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " #keyTextFieldContainer "
            + "#errorMessage>small";
    public static final String MULTI_SECRET_VALUE_FIELD_ERROR_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " #valueError>small";
    public static final String MULTI_SECRET_KEY_FIELD_ERROR_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " #keyFieldValidationError>small";
    public static final String MULTI_SECRET_FILE_UPLOAD_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " #uploadFileButton input[type=file]";
    public static final String MULTI_SECRET_KV_PAIR_SELECTOR = MULTI_SECRET_CARD_GROUP_SELECTOR + " .keyValuePairGroup .keyValuePair";
    public static final String MULTI_SECRET_KEY_TEXTFIELD = MULTI_SECRET_KV_PAIR_SELECTOR + "  .key e-generic-text-field.textField "
            + "eui-base-v0-text-field";
    public static final String MULTI_SECRET_VALUE_TEXTFIELD = MULTI_SECRET_KV_PAIR_SELECTOR + " .value e-generic-text-field.textField "
            + "eui-base-v0-text-field";
    public static final String MULTI_SECRET_VALUE_TEXTFIELD_STATE = MULTI_SECRET_VALUE_TEXTFIELD + " input#item";
    public static final String MULTI_SECRET_HIDDEN_EYE = MULTI_SECRET_VALUE_TEXTFIELD + " eui-v0-icon[name=\"eye\"]";
    public static final String MULTI_SECRET_VALUE_TEXTFIELD_CLEAR = MULTI_SECRET_VALUE_TEXTFIELD + " eui-v0-icon[name=\"cross\"]";
    public static final String MULTI_SECRET_CHEVRON = MULTI_SECRET_CARD_GROUP_SELECTOR + " #chevronTooltip";
    public static final String MULTI_SECRET_SUBTITLE = MULTI_SECRET_CARD_GROUP_SELECTOR + " .eui__card__subtitle";
    public static final String MULTI_SECRET_DELETE_KEY_VALUE_PAIR = MULTI_SECRET_CARD_GROUP_SELECTOR + " #deleteKeyValuePairIcon";

    //Deployable Modules selectors
    public static final String FIRST_DEPLOYABLE_MODULE_KEY = "deployable_module_1";
    public static final String FIRST_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-enabled-deployable_module_1";
    public static final String FIRST_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-disabled-deployable_module_1";
    public static final String SECOND_DEPLOYABLE_MODULE_KEY = "deployable_module_2";
    public static final String SECOND_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-enabled-deployable_module_2";
    public static final String SECOND_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-disabled-deployable_module_2";
    public static final String THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-enabled-deployable_module_3";
    public static final String THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR = "#extension-deployableModules-disabled-deployable_module_3";
    public static final String DEPLOYABLE_MODULE_DISABLED = "disabled";
    public static final String DEPLOYABLE_MODULES = "Deployable Modules";

    private Constants() {
        // constructor is private
    }
}
