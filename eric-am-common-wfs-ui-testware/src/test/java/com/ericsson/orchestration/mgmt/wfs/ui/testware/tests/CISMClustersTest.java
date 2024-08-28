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

import static org.assertj.core.api.Assertions.assertThat;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsDisabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsEnabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonName;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkRowSelected;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkSubtitle;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickDialogButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickFullTableRow;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickPaginatedPageElement;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillOutWizardValueTextArea;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getFilePath;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.manualSleep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyElementAttributeEqualTo;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CISM_CLUSTERS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLUSTERS_TABLE_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLUSTERS_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DESCRIPTION_PLACEHOLDER_SELECTOR;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class CISMClustersTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(CISMClustersTest.class);

    private static final String REGISTER_CLUSTER_TEXT = "Register cluster";
    private static final String UPDATE_CLUSTER_TEXT = "Update cluster config";
    private static final String SELECT_FILE_TEXT = "Select file";
    private static final String DESCRIPTION_HEADER_TEXT = "Description";
    private static final String DESCRIPTION_PLACEHOLDER_TEXT = "Enter a description";
    private static final String UPLOAD_FILE_TEXT = "Upload File*";
    private static final String FILE_INPUT_PLACEHOLDER_TEXT = "Select file to upload";
    private static final String DESCRIPTION_TEXT = "Description for cluster registration via UI";
    private static final String DESCRIPTION_TEXT_FOR_DUPLICATE_TEST = "Description for duplicate cluster config file";
    private static final String CONFIG_FILE_NAME = "hahn064.config";
    private static final String INVALID_CONFIG_NAME = "hahn064.sh";
    private static final String ALREADY_EXISTING_CONFIG_FILE_NAME = "withNameDuplication.config";
    private static final String SUCCESS = "Success\n";
    private static final String SUCCESSFUL_REGISTRATION_MESSAGE = SUCCESS + "Registered";
    private static final String SUCCESSFUL_UPDATE_MESSAGE = SUCCESS + "Cluster config for cluster3.config has been updated";
    private static final String SUCCESSFUL_DEREGISTRATION_MESSAGE = SUCCESS + "Deregistered";
    private static final String SUCCESSFUL_MAKE_UPDATE_MESSAGE = SUCCESS + "Cluster cluster3.config has been set as default";
    private static final String FAILED_REGISTRATION_DUPLICATE_MESSAGE = "Cluster failed to register\n" + "File with name withNameDuplication"
            + ".config already exists.";
    private static final String INVALID_FILE_TYPE_MESSAGE = "File type \"%s\" not supported, only \".config\" files are supported.";
    private static final String DEREGISTER_TITLE_TEXT = "Deregister CISM cluster";
    private static final String MAKE_DEFAULT_TITLE_TEXT = "Change default cluster";
    private static final String NOT_IN_USE_CLUSTER_NAME = "cluster3";
    private static final String DEREGISTER_CLUSTER_FORM_TEXT = NOT_IN_USE_CLUSTER_NAME + " will be deregistered, do you want to proceed?";
    private static final String MAKE_DEFAULT_CLUSTER_FORM_TEXT = NOT_IN_USE_CLUSTER_NAME + " will be set as default cluster, do you want to proceed?";
    private static final String DEREGISTER_CLUSTER_MENU_ITEM = "Deregister-cluster";
    private static final String MAKE_DEFAULT_CLUSTER_MENU_ITEM = "Make-default";
    private static final String UPDATE_CLUSTER_MENU_ITEM = "Update-cluster-config";
    private static final int NUMBER_OF_CLUSTERS_PAGE_ONE = 15;
    private static final int NUMBER_OF_CLUSTERS_PAGE_TWO = 9;
    private static final int NUMBER_OF_TOTAL_CLUSTERS = 24;
    private static final String REGISTER_CLUSTER_BUTTON_SELECTOR = "#appbar-component-container eui-base-v0-button";
    private static final String REGISTER_CLUSTER_DIALOG_SELECTOR = ".dialog";
    private static final String REGISTER_CLUSTER_FORM_HEAD_TEXT_SELECTOR = ".dialog__title";
    private static final String CANCEL_BUTTON_SELECTOR = "#Cancel";
    private static final String UPLOAD_BUTTON_SELECTOR = "#Upload";
    private static final String UPLOAD_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM = ".btn.primary";
    private static final String CANCEL_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM = ".btn";
    private static final String CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER = "Placeholder";
    private static final String SELECT_FILE_BUTTON_SELECTOR = "eui-base-v0-file-input.selectFile";
    private static final String SELECT_FILE_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM = "eui-base-v0-file-input.select-file";
    private static final String DESCRIPTION_SECTION_SELECTOR = ".leftTableCell";
    private static final String UPLOAD_FILE_TEXT_SELECTOR = ".label";
    private static final String FILE_INPUT_PLACEHOLDER_SELECTOR = "#fileInput";
    private static final String FILE_INPUT_SELECTOR = "input[type=file]";
    private static final String IS_DEFAULT_CHECKBOX_SELECTOR = "eui-base-v0-checkbox#isDefault";
    private static final String IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM = "eui-base-v0-checkbox#isDefaultCheckbox";
    private static final String SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM = "eui-base-v0-checkbox#skipVerificationCheckbox";
    private static final String IS_DEFAULT_CHECKBOX_TEXT = "Is default";
    private static final String SKIP_VERIFICATION_CHECKBOX_TEXT = "Skip cluster verification";
    private static final String OPERATION_RESULT_MESSAGE_SELECTOR = "eui-base-v0-notification";
    private static final String INVALID_FILE_ERROR_SELECTOR = "span.errorMessage.invalidFileType";
    private static final String CHECKED = "checked";
    private static final String TRUE = "true";
    private static final String DEREGISTER_CLUSTER_FORM_SELECTOR = "div.dialog";
    private static final String DEREGISTER_FORM_TITLE_SELECTOR = "div.dialog__title";
    private static final String UPDATE_CLUSTER_FORM_SELECTOR = "div.dialog";
    private static final String MAKE_DEFAULT_CLUSTER_SELECTOR = "div.dialog";
    private static final String MAKE_DEFAULT_FORM_TITLE_SELECTOR = "div.dialog__title";
    private static final String DEREGISTER_BUTTON_SELECTOR = "eui-base-v0-button[locale][warning]";
    private static final String CANCEL_DEREGISTER_BUTTON_SELECTOR = "eui-base-v0-dialog eui-base-v0-button:first-of-type";
    private static final String DEREGISTER_CLUSTER_FORM_TEXT_SELECTOR = "eui-base-v0-dialog > div";
    private static final String MAKE_DEFAULT_CLUSTER_FORM_TEXT_SELECTOR = "eui-base-v0-dialog > div";
    private static final String NOT_IN_USE_CLUSTER_MENU_SELECTOR = "e-context-menu#cluster3";
    private static final String CANCEL_MAKE_DEFAULT_BUTTON_SELECTOR = "eui-base-v0-dialog eui-base-v0-button:first-of-type";
    private static final String CONFIRM_MAKE_DEFAULT_BUTTON_SELECTOR = "eui-base-v0-button[locale][primary]";
    private static final String IN_USE_CLUSTER_MENU_SELECTOR = "e-context-menu[id*=\"undefined__cluster2\"]";
    public static final String CLUSTER_CONFIGS_FOLDER = "cluster-configs/";
    public static final String CRD_NAMESPACE_TEXT_FIELD_SELECTOR = ".crdNamespace #textInput";
    public static final String VALID_CRD_NAMESPACE = "crd-namespace";
    public static final String INVALID_CRD_NAMESPACE = "kube-public";
    public static final String CRD_NAMESPACE_ERROR_SELECTOR = "span.errorMessage.invalidCrdNamespace";
    public static final String INVALID_CRD_NAMESPACE_ERROR_MSG = "Kubernetes reserved namespace: %s cannot be used as a CRD namespace.";
    public static final String CLUSTER_PAGINATION = "eui-pagination-v0";
    public static final String PAGINATION_NUM_PAGES = "num-pages";
    public static final String PAGINATION_CURRENT_PAGE = "current-page";
    private static final String UPDATE_CLUSTER_FORM_HEAD_TEXT_SELECTOR = ".dialog__title";
    private static final String UPLOAD_BUTTON_IS_ENABLED = "Verify that Upload button is disabled and that Cancel button is enabled";

    @Test(dataProvider = "driver")
    public void clustersListFlow(String version, RemoteWebDriver driver) {

        try {

            loadApplication(CISM_CLUSTERS, driver);
            driver.manage().window().maximize();
            assertThat(driver.getCurrentUrl()).contains(CLUSTERS_URL_PART);

            LOGGER.info("Verify that all clusters are displayed on the CISM Clusters page");
            List<WebElement> tableRows = querySelectAll(driver, "e-generic-table#" + CLUSTERS_TABLE_ID + " tbody tr");//change
            assertThat(tableRows).isNotNull();
            assertThat(tableRows.size()).isEqualTo(NUMBER_OF_CLUSTERS_PAGE_ONE);
            verifyTableRowsSelectedAndDeselected(driver, CLUSTERS_TABLE_ID);
            verifyTableIsPaginated(driver);

            LOGGER.info("Verify that [Register cluster] button is displayed correctly and enabled");
            checkButtonIsEnabled(driver, REGISTER_CLUSTER_BUTTON_SELECTOR);
            checkButtonName(driver, REGISTER_CLUSTER_BUTTON_SELECTOR, REGISTER_CLUSTER_TEXT);

            LOGGER.info("Verify that \"Register cluster\" form is displayed correctly");
            openRegisterClusterForm(driver);
            verifyRegisterClusterForm(driver);
            clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);

            LOGGER.info("Verify that cluster can not be registered without config file - Upload button is disabled");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, "", false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            checkButtonIsDisabled(driver, UPLOAD_BUTTON_SELECTOR);
            cancelRegisterClusterForm(driver);

            LOGGER.info("Verify that cluster can not be registered with not .config file - error appears");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, INVALID_CONFIG_NAME, true, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            checkDisplayedError(driver, INVALID_FILE_ERROR_SELECTOR, String.format(INVALID_FILE_TYPE_MESSAGE, "sh"));
            clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster registration can be cancelled");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster can be registered with correct config file");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clickOnTheButton(driver, UPLOAD_BUTTON_SELECTOR);
            checkOperationResultMessageIsReceived(driver, SUCCESSFUL_REGISTRATION_MESSAGE);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster can be registered without description");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, "", false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clickOnTheButton(driver, UPLOAD_BUTTON_SELECTOR);
            checkOperationResultMessageIsReceived(driver, SUCCESSFUL_REGISTRATION_MESSAGE);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster can not be registered with the same cluster config file name");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, ALREADY_EXISTING_CONFIG_FILE_NAME, false, DESCRIPTION_TEXT_FOR_DUPLICATE_TEST, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clickOnTheButton(driver, UPLOAD_BUTTON_SELECTOR);
            checkOperationResultMessageIsReceived(driver, FAILED_REGISTRATION_DUPLICATE_MESSAGE);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster cannot be registered with invalid crdNamespace");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, "", false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clearTextField(driver, CRD_NAMESPACE_TEXT_FIELD_SELECTOR);
            fillTextField(driver, CRD_NAMESPACE_TEXT_FIELD_SELECTOR, INVALID_CRD_NAMESPACE);
            checkDisplayedError(driver, CRD_NAMESPACE_ERROR_SELECTOR, String.format(INVALID_CRD_NAMESPACE_ERROR_MSG, INVALID_CRD_NAMESPACE));
            checkButtonIsDisabled(driver, UPLOAD_BUTTON_SELECTOR);
            cancelRegisterClusterForm(driver);

            LOGGER.info("Verify that cluster cannot be registered with only crdNamespace");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, "", false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clearTextField(driver, CRD_NAMESPACE_TEXT_FIELD_SELECTOR);
            fillTextField(driver, CRD_NAMESPACE_TEXT_FIELD_SELECTOR, VALID_CRD_NAMESPACE);
            checkButtonIsDisabled(driver, UPLOAD_BUTTON_SELECTOR);
            cancelRegisterClusterForm(driver);

            LOGGER.info("Verify that cluster can be registered without crdNamespace");
            openRegisterClusterForm(driver);
            fillRegisterOrUpdateClusterForm(driver, "", false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clearTextField(driver, CRD_NAMESPACE_TEXT_FIELD_SELECTOR);
            fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, DESCRIPTION_TEXT, false, IS_DEFAULT_CHECKBOX_SELECTOR);
            clickOnTheButton(driver, UPLOAD_BUTTON_SELECTOR);
            checkOperationResultMessageIsReceived(driver, SUCCESSFUL_REGISTRATION_MESSAGE);
            checkRegisterClusterFormIsClosed(driver);

            LOGGER.info("Verify 'is default' checkbox is working as expected.");
            openRegisterClusterForm(driver);
            verifyElementAttributeEqualTo(driver, IS_DEFAULT_CHECKBOX_SELECTOR, CHECKED, null);
            clickOnTheButton(driver, IS_DEFAULT_CHECKBOX_SELECTOR);
            verifyElementAttributeEqualTo(driver, IS_DEFAULT_CHECKBOX_SELECTOR, CHECKED, TRUE);
            clickOnTheButton(driver, IS_DEFAULT_CHECKBOX_SELECTOR);
            verifyElementAttributeEqualTo(driver, IS_DEFAULT_CHECKBOX_SELECTOR, CHECKED, null);
            cancelRegisterClusterForm(driver);

            LOGGER.info("Verify that Deregister CISM cluster form is displayed correctly");
            openDeregisterForm(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
            verifyDeregisterClusterForm(driver);

            LOGGER.info("Verify that cluster deregisteration can be cancelled");
            cancelDeregisterClusterForm(driver);

            LOGGER.info("Verify that cluster can be deregistered if it is in \"Not in use\" state");
            openDeregisterForm(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
            clickOnTheButton(driver, DEREGISTER_BUTTON_SELECTOR);
            checkOperationResultMessageIsReceived(driver, SUCCESSFUL_DEREGISTRATION_MESSAGE);
            checkDeregisterClusterFormIsClosed(driver);

            LOGGER.info("Verify that cluster can not be deregistered if it is in \"In use\" state");
            checkNoContextMenuForInUseCluster(driver, IN_USE_CLUSTER_MENU_SELECTOR);
        } catch (Exception e) {
            takeScreenshot(driver, "cism_cluster_test_" + version);
            throw e;
        }

        LOGGER.info("Verify that an user can make a cluster as default");
        selectMakeDefaultOption(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
        verifyMakeDefaultClusterForm(driver);
        clickDialogButton(driver, "Confirm");
        checkOperationResultMessageIsReceived(driver, SUCCESSFUL_MAKE_UPDATE_MESSAGE);
        checkMakeDefaultClusterFormIsClosed(driver);

        LOGGER.info("Verify that an user can cancel 'make a cluster as default' choice");
        selectMakeDefaultOption(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
        cancelMakeDefaultClusterForm(driver);

        LOGGER.info("Verify that a new cluster can be registered with 'isDefault' value is true");
        openRegisterClusterForm(driver);
        fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, DESCRIPTION_TEXT, true, IS_DEFAULT_CHECKBOX_SELECTOR);
        clickOnTheButton(driver, UPLOAD_BUTTON_SELECTOR);
        checkOperationResultMessageIsReceived(driver, SUCCESSFUL_REGISTRATION_MESSAGE);
        checkRegisterClusterFormIsClosed(driver);

        LOGGER.info("Verify that Update button is disabled");
        openUpdateClusterForm(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
        WebElement updateButton = querySelect(driver, UPLOAD_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        assertThat(updateButton.getAttribute("disabled")).isEqualTo(null);

        LOGGER.info("Verify that cluster update can be cancelled");
        cancelUpdateClusterForm(driver);

        LOGGER.info("Verify that cluster can be updated");
        openUpdateClusterForm(driver, NOT_IN_USE_CLUSTER_MENU_SELECTOR);
        verifyUpdateClusterForm(driver);
        fillRegisterOrUpdateClusterForm(driver, CONFIG_FILE_NAME, false, DESCRIPTION_TEXT, true, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        clickDialogButton(driver, "Upload");
        checkOperationResultMessageIsReceived(driver, SUCCESSFUL_UPDATE_MESSAGE);
        checkUpdateClusterFormIsClosed(driver);
    }

    private static void verifyTableIsPaginated(final RemoteWebDriver driver) {
        LOGGER.info("Verify clusters table is paginated on CISM Clusters page");

        WebElement clusterPagniationTable = querySelect(driver, CLUSTER_PAGINATION);
        assertThat(clusterPagniationTable).isNotNull();
        assertThat(clusterPagniationTable.getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo("1");
        assertThat(clusterPagniationTable.getAttribute(PAGINATION_NUM_PAGES)).isEqualTo("2");
        checkSubtitle(driver, String.format("(1 - %d of %d)", NUMBER_OF_CLUSTERS_PAGE_ONE, NUMBER_OF_TOTAL_CLUSTERS));

        clickPaginatedPageElement(driver, CLUSTER_PAGINATION, "2");
        manualSleep(2000);
        final List<WebElement> tableRows = querySelectAll(driver, "e-generic-table#" + CLUSTERS_TABLE_ID + " tbody tr");
        assertThat(tableRows).isNotNull();
        assertThat(tableRows.size()).isEqualTo(NUMBER_OF_CLUSTERS_PAGE_TWO);
        clusterPagniationTable = querySelect(driver, CLUSTER_PAGINATION);
        assertThat(clusterPagniationTable.getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo("2");
        checkSubtitle(driver, String.format("(%d - %d of %d)", NUMBER_OF_CLUSTERS_PAGE_ONE + 1, NUMBER_OF_TOTAL_CLUSTERS, NUMBER_OF_TOTAL_CLUSTERS));

        clickPaginatedPageElement(driver, CLUSTER_PAGINATION, "left");
        assertThat(clusterPagniationTable.getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo("1");
    }

    private static void verifyRegisterClusterForm(RemoteWebDriver driver) {

        LOGGER.info("Verify that form header is displayed correctly");
        assertThat(querySelect(driver, REGISTER_CLUSTER_FORM_HEAD_TEXT_SELECTOR).getText()).isEqualTo(REGISTER_CLUSTER_TEXT);

        LOGGER.info("Verify Upload section is displayed according to mock-ups");
        checkButtonName(driver, SELECT_FILE_BUTTON_SELECTOR, SELECT_FILE_TEXT);
        checkButtonIsEnabled(driver, SELECT_FILE_BUTTON_SELECTOR);
        WebElement uploadFileText = querySelect(driver, UPLOAD_FILE_TEXT_SELECTOR);
        assertThat(uploadFileText.getText().equals(UPLOAD_FILE_TEXT)).isTrue();
        WebElement fileInputPlaceholderText = querySelect(driver, FILE_INPUT_PLACEHOLDER_SELECTOR);
        assertThat(fileInputPlaceholderText.getAttribute(CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER).equals(FILE_INPUT_PLACEHOLDER_TEXT)).isTrue();

        LOGGER.info("Verify that Description section is displayed correctly");
        WebElement descriptionSection = querySelect(driver, DESCRIPTION_SECTION_SELECTOR);
        assertThat(descriptionSection.getText()).isEqualTo(DESCRIPTION_HEADER_TEXT);
        WebElement descriptionPlaceholder = querySelect(driver, DESCRIPTION_PLACEHOLDER_SELECTOR);
        assertThat(descriptionPlaceholder.getAttribute(CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER)).isEqualTo(DESCRIPTION_PLACEHOLDER_TEXT);

        LOGGER.info("Verify that is default section is displayed correctly");
        WebElement isDefaultCheckbox = querySelect(driver, IS_DEFAULT_CHECKBOX_SELECTOR);
        assertThat(isDefaultCheckbox.getAttribute("innerText")).isEqualTo(IS_DEFAULT_CHECKBOX_TEXT);
        assertThat(isDefaultCheckbox.getAttribute(CHECKED)).isNull();

        LOGGER.info(UPLOAD_BUTTON_IS_ENABLED);
        checkButtonIsDisabled(driver, UPLOAD_BUTTON_SELECTOR);
        checkButtonIsEnabled(driver, CANCEL_BUTTON_SELECTOR);
    }

    private static void fillRegisterOrUpdateClusterForm(RemoteWebDriver driver, String clusterName, boolean configFileErrorAppears,
                                                        String description,
                                                Boolean isDefault, String isDefaultCheckboxSelector) {
        if (!clusterName.isEmpty()) {
            if (!driver.getCurrentUrl().contains("127.0.0.1") && !driver.getCurrentUrl().contains("localhost") && !driver.getCurrentUrl().contains(
                    "host.testcontainers")) {
                driver.setFileDetector(new LocalFileDetector());
            }
            WebElement fileInput = querySelect(driver, FILE_INPUT_SELECTOR);

            String clusterConfigPath = getFilePath(CLUSTER_CONFIGS_FOLDER + clusterName);
            LOGGER.info("Cluster config Path: {}" , clusterConfigPath);
            fileInput.sendKeys(clusterConfigPath);
            WebElement fileInputPlaceholderText = querySelect(driver, FILE_INPUT_PLACEHOLDER_SELECTOR);
            manualSleep(2000);
            if (!configFileErrorAppears) {
                assertThat(fileInputPlaceholderText.getAttribute(CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER).equals(clusterName)).isTrue();
            }
        }
        if (!description.isEmpty()) {
            fillOutWizardValueTextArea(driver, DESCRIPTION_PLACEHOLDER_SELECTOR, description);
            assertThat(querySelect(driver, DESCRIPTION_PLACEHOLDER_SELECTOR).getAttribute("value").equals(description)).isTrue();
        }
        if (isDefault.equals(true)) {
            verifyElementAttributeEqualTo(driver, isDefaultCheckboxSelector, CHECKED, null);
            clickOnTheButton(driver, isDefaultCheckboxSelector);
            verifyElementAttributeEqualTo(driver, isDefaultCheckboxSelector, CHECKED, TRUE);
        }
        LOGGER.info("Register or Update cluster form is filled");
    }

    private static void openRegisterClusterForm(RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));

        LOGGER.info("Open Register cluster form");
        clickOnTheButton(driver, REGISTER_CLUSTER_BUTTON_SELECTOR);

        LOGGER.info("Verify that Register cluster form is opened");
        wait.until(item -> querySelect(driver, REGISTER_CLUSTER_DIALOG_SELECTOR).isDisplayed());
    }

    private static void cancelRegisterClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Cancel Register cluster form");
        clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);
        checkRegisterClusterFormIsClosed(driver);
    }

    private static void checkRegisterClusterFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Register cluster form is closed");
        assertThat(querySelect(driver, REGISTER_CLUSTER_DIALOG_SELECTOR)).isNull();
    }

    private static void checkOperationResultMessageIsReceived(RemoteWebDriver driver, String message) {
        LOGGER.info("Verify that operation result message {} was received", message);
        waitForElementWithText(driver, OPERATION_RESULT_MESSAGE_SELECTOR, message);
    }

    private static void checkDisplayedError(RemoteWebDriver driver, String errorTextselector, String errorText) {
        LOGGER.info("Verify that error {} appears", errorText);
        waitForElementWithText(driver, errorTextselector, errorText);
    }

    private static void verifyDeregisterClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Verify that Deregister form header is displayed correctly");
        assertThat(querySelect(driver, DEREGISTER_FORM_TITLE_SELECTOR).getText()).isEqualTo(DEREGISTER_TITLE_TEXT);

        LOGGER.info("Verify form's text is displayed according to mock-ups");
        assertThat(querySelect(driver, DEREGISTER_CLUSTER_FORM_TEXT_SELECTOR).getText()).isEqualTo(DEREGISTER_CLUSTER_FORM_TEXT);

        LOGGER.info(UPLOAD_BUTTON_IS_ENABLED);
        checkButtonIsEnabled(driver, CANCEL_DEREGISTER_BUTTON_SELECTOR);
        checkButtonIsEnabled(driver, DEREGISTER_BUTTON_SELECTOR);
    }


    private static void verifyMakeDefaultClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Verify that Make default form header is displayed correctly");
        assertThat(querySelect(driver, MAKE_DEFAULT_FORM_TITLE_SELECTOR).getText()).isEqualTo(MAKE_DEFAULT_TITLE_TEXT);

        LOGGER.info("Verify form's text is displayed according to mock-ups");
        assertThat(querySelect(driver, MAKE_DEFAULT_CLUSTER_FORM_TEXT_SELECTOR).getText()).isEqualTo(MAKE_DEFAULT_CLUSTER_FORM_TEXT);

        LOGGER.info("Verify that Cancel and Confirm buttons are enabled");
        checkButtonIsEnabled(driver, CANCEL_MAKE_DEFAULT_BUTTON_SELECTOR);
        checkButtonIsEnabled(driver, CONFIRM_MAKE_DEFAULT_BUTTON_SELECTOR);
    }

    private static void verifyTableRowsSelectedAndDeselected(RemoteWebDriver driver, String tableIDSelector) {
        LOGGER.info("Verify that clusters can be selected and deselected");
        clickFullTableRow(tableIDSelector, "1", driver);
        assertThat(checkRowSelected("1", false, driver)).isTrue();
        clickFullTableRow(tableIDSelector, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isTrue();
        assertThat(checkRowSelected("1", false, driver)).isFalse();
        clickFullTableRow(tableIDSelector, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isFalse();
    }

    private static void openDeregisterForm(RemoteWebDriver driver, String clusterMenuSelector) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        clickContextMenuItem(driver, wait, clusterMenuSelector, DEREGISTER_CLUSTER_MENU_ITEM);
        wait.until(item -> querySelect(driver, DEREGISTER_CLUSTER_FORM_SELECTOR).isDisplayed());
    }

    private static void cancelDeregisterClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Cancel Deregister cluster form");
        clickOnTheButton(driver, CANCEL_DEREGISTER_BUTTON_SELECTOR);
        checkDeregisterClusterFormIsClosed(driver);
    }

    private static void checkDeregisterClusterFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Deregister cluster form is closed");
        manualSleep(500);
        assertThat(querySelect(driver, DEREGISTER_CLUSTER_FORM_SELECTOR)).isNull();
    }

    private static void checkNoContextMenuForInUseCluster(RemoteWebDriver driver, String clusterContextMenuSelector) {
        LOGGER.info("Verify that for cluster in \"In use\" state there is no context menu");
        assertThat(querySelect(driver, clusterContextMenuSelector)).isNull();
    }

    private static void selectMakeDefaultOption(RemoteWebDriver driver, String clusterMenuSelector) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        clickContextMenuItem(driver, wait, clusterMenuSelector, MAKE_DEFAULT_CLUSTER_MENU_ITEM);
        wait.until(item -> querySelect(driver, MAKE_DEFAULT_CLUSTER_SELECTOR).isDisplayed());
    }

    private static void cancelMakeDefaultClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Cancel Make default cluster form");
        clickOnTheButton(driver, CANCEL_MAKE_DEFAULT_BUTTON_SELECTOR);
        checkDeregisterClusterFormIsClosed(driver);
    }

    private static void checkMakeDefaultClusterFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Make default cluster form is closed");
        manualSleep(500);
        assertThat(querySelect(driver, MAKE_DEFAULT_CLUSTER_SELECTOR)).isNull();
    }

    private static void verifyUpdateClusterForm(RemoteWebDriver driver) {

        LOGGER.info("Verify that form header is displayed correctly");
        assertThat(querySelect(driver, UPDATE_CLUSTER_FORM_HEAD_TEXT_SELECTOR).getText()).isEqualTo(UPDATE_CLUSTER_TEXT);

        LOGGER.info("Verify Upload section is displayed according to mock-ups");
        checkButtonName(driver, SELECT_FILE_BUTTON_SELECTOR, SELECT_FILE_TEXT);
        checkButtonIsEnabled(driver, SELECT_FILE_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        WebElement uploadFileText = querySelect(driver, UPLOAD_FILE_TEXT_SELECTOR);
        assertThat(uploadFileText.getText().equals(UPLOAD_FILE_TEXT)).isTrue();
        WebElement fileInputPlaceholderText = querySelect(driver, FILE_INPUT_PLACEHOLDER_SELECTOR);
        assertThat(fileInputPlaceholderText.getAttribute(CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER).equals(FILE_INPUT_PLACEHOLDER_TEXT)).isTrue();

        LOGGER.info("Verify that Description area is displayed correctly");
        WebElement descriptionPlaceholder = querySelect(driver, DESCRIPTION_PLACEHOLDER_SELECTOR);
        assertThat(descriptionPlaceholder.getAttribute(CLUSTER_NAME_ATTRIBUTE_PLACEHOLDER)).isEqualTo(DESCRIPTION_PLACEHOLDER_TEXT);

        LOGGER.info("Verify that 'isDefault' section is displayed correctly");
        WebElement isDefaultCheckbox = querySelect(driver, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        assertThat(isDefaultCheckbox.getAttribute("innerText")).isEqualTo(IS_DEFAULT_CHECKBOX_TEXT);
        assertThat(isDefaultCheckbox.getAttribute(CHECKED)).isNull();
        clickOnTheButton(driver, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        verifyElementAttributeEqualTo(driver, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM, CHECKED, TRUE);
        clickOnTheButton(driver, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        verifyElementAttributeEqualTo(driver, IS_DEFAULT_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM, CHECKED, null);

        LOGGER.info("Verify that 'Skip cluster verification' section is displayed correctly");
        WebElement skipVerificationCheckbox = querySelect(driver, SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        assertThat(skipVerificationCheckbox.getAttribute("innerText")).isEqualTo(SKIP_VERIFICATION_CHECKBOX_TEXT);
        assertThat(skipVerificationCheckbox.getAttribute(CHECKED)).isNull();
        clickOnTheButton(driver, SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        verifyElementAttributeEqualTo(driver, SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM, CHECKED, TRUE);
        clickOnTheButton(driver, SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        verifyElementAttributeEqualTo(driver, SKIP_VERIFICATION_CHECKBOX_SELECTOR_ON_UPDATE_CLUSTER_FORM, CHECKED, null);

        LOGGER.info(UPLOAD_BUTTON_IS_ENABLED);
        WebElement uploadButton = querySelect(driver, UPLOAD_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM);
        assertThat(uploadButton.getAttribute("disabled")).isNull();
        checkButtonIsEnabled(driver, CANCEL_BUTTON_SELECTOR_ON_UPDATE_CLUSTER_FORM);
    }

    private static void openUpdateClusterForm(RemoteWebDriver driver, String clusterMenuSelector) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        clickContextMenuItem(driver, wait, clusterMenuSelector, UPDATE_CLUSTER_MENU_ITEM);
        wait.until(item -> querySelect(driver, UPDATE_CLUSTER_FORM_SELECTOR).isDisplayed());
    }

    private static void cancelUpdateClusterForm(RemoteWebDriver driver) {
        LOGGER.info("Cancel Update cluster form");
        clickDialogButton(driver, "Cancel");
        checkUpdateClusterFormIsClosed(driver);
    }

    private static void checkUpdateClusterFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Register cluster form is closed");
        assertThat(querySelect(driver, UPDATE_CLUSTER_FORM_SELECTOR)).isNull();
    }
}
