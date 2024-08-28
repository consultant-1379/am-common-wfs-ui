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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.CLUSTER_DROPDOWN;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.CLUSTER_DROPDOWN_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.CLUSTER_DROPDOWN_SELECTED;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.CLUSTER_INPUT_FIELD;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.COMBO_BOX_ITEM_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.RADIO_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearInputField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickDisableRadioButtonsForAllDeployableModules;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickEnableRadioButtonForThirdDeployableModule;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillOutWizardValue;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getAdditionalAttributes;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getAdditionalAttributesValuesFromAdditionalAttributesStep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getDeployableModulesFromSummaryStep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getExpectedDeployableModules;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getGenericKeyValueMap;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.manualSleep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.scrollIntoView;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.selectFromDropdown;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.validateMultiSecret;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementContainingText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ADDITIONAL_ATTRIBUTES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ASPECT_PAYLOAD_2_CISM_CONTROLLED_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ASPECT_PAYLOAD_2_MANUAL_CONTROLLED_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLUSTER;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLUSTER_SUMMARY_INFO_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DEFAULT_CLUSTER;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DYNAMIC_SCALE_LEVEL_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ERROR_TEXT_TOO_LONG_RESOURCE_NAME;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.EXTERNAL_CLUSTER;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FINISH_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GENERAL_ATTRIBUTES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GENERAL_ATTRIBUTES_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INFRASTRUCTURE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INFRASTRUCTURE_FIELDS_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATE_OPERATION_STARTED_DIALOG_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATE_OPERATION_STARTED_DIALOG_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATION_LEVEL_DROPDOWN;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATION_LEVEL_DROPDOWN_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATION_LEVEL_DROPDOWN_SELECTED;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATION_LEVEL_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATION_SCALE_LEVEL_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NAME;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NAMESPACE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NAMESPACE_FIELD_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NEXT_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGE_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGE_SELECTION;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PERSIST_SCALE_INFO_CHECKBOX_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_INSTANCE_NAME_FIELD_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_NAME_TOO_LONG_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_NAME_VALID_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SEE_RESOURCE_LIST_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SKIP_MERGING_PREVIOUS_VALUES_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SUMMARY;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.WIZARD_STEP_SELECTED_TITLE;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class InstantiateWizardTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(InstantiateWizardTest.class);

    public static final String SCALE_LEVEL_FORMATTER = "#%s %s";

    public static final String VALIDATION_ICON = "eui-v0-icon";
    public static final String VALIDATION_FAILED = "cross";
    public static final String VALIDATION_SUCCESS = "check";
    public static final String PAYLOAD_ASPECT_ID = "Payload";
    public static final String PAYLOAD_ASPECT_LABEL = "Payload(Payload)";
    public static final String PAYLOAD_2_ASPECT_ID = "Payload_2";
    public static final String PAYLOAD_2_ASPECT_LABEL = "Payload_2(Payload_2)";
    public static final String SCALE_LEVEL_TITLE_SELECTOR = " .scale-level--title";
    public static final String SCALE_LEVEL_INPUT_SELECTOR = " .scale-level--input";
    public static final String SCALE_LEVEL_MESSAGE_SELECTOR = " .scale-level--message";

    public static final String PAYLOAD_MESSAGE = "Scale level must be between 0 and 10";

    public static final String PAYLOAD_2_MESSAGE = "Scale level must be between 0 and 5";

    @Test(dataProvider = "driver")
    public void instantiateFlow(String version, RemoteWebDriver driver) throws IOException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(50L));
            loadApplication(PACKAGES, driver);
            driver.manage().window().maximize();
            assertThat(driver.getCurrentUrl()).contains(PACKAGES_URL_PART);

            waitForElementWithText(driver, "div[column=appProvider]", "Ericsson");

            LOGGER.info("Opening context menu and clicking the Instantiate option");
            clickContextMenuItem(driver, wait, PACKAGE_CONTEXT_MENU_SELECTOR, INSTANTIATE);

            LOGGER.info("Instantiate Step 1 - Package Selection");
            assertThat(querySelect(driver, WIZARD_STEP_SELECTED_TITLE).getText()).isEqualTo(PACKAGE_SELECTION);
            manualSleep(300);
            clickOnTheButton(driver, NEXT_BUTTON);

            LOGGER.info("Instantiate Step 2 - Infrastructure");
            LOGGER.info("Selecting the cluster");
            waitForElementContainingText(driver, WIZARD_STEP_SELECTED_TITLE, INFRASTRUCTURE);
            assertThat(querySelect(driver, WIZARD_STEP_SELECTED_TITLE).getText()).isEqualTo(INFRASTRUCTURE);
            WebElement dropdown = querySelect(driver, CLUSTER_DROPDOWN);
            WebElement selectedCluster = querySelect(driver, CLUSTER_DROPDOWN_SELECTED);
            clearInputField(driver, CLUSTER_INPUT_FIELD);
            selectFromDropdown(driver, DEFAULT_CLUSTER, CLUSTER_DROPDOWN_MENU_SELECTOR, COMBO_BOX_ITEM_SELECTOR, selectedCluster);
            assertThat(selectedCluster.getAttribute(VALUE).equals(DEFAULT_CLUSTER)).isTrue();

            selectFromDropdown(driver, EXTERNAL_CLUSTER, CLUSTER_DROPDOWN_MENU_SELECTOR, COMBO_BOX_ITEM_SELECTOR, dropdown);
            selectedCluster = querySelect(driver, CLUSTER_DROPDOWN_SELECTED);
            assertThat(selectedCluster.getAttribute(VALUE).equals(EXTERNAL_CLUSTER)).isTrue();

            LOGGER.info("Entering the namespace");
            fillOutWizardValue(driver, NAMESPACE_FIELD_SELECTOR, NAMESPACE);
            manualSleep(300);
            clickOnTheButton(driver, NEXT_BUTTON);

            LOGGER.info("Instantiate Step 3 - General attributes");
            LOGGER.info("Entering the resource instance to confirm that it causes the appropriate error");
            querySelectAll(driver, "qwe");
            waitForElementContainingText(driver, WIZARD_STEP_SELECTED_TITLE, GENERAL_ATTRIBUTES);
            assertThat(querySelect(driver, WIZARD_STEP_SELECTED_TITLE).getText()).isEqualTo(GENERAL_ATTRIBUTES);
            final Map<String, String> keyValueMap = getGenericKeyValueMap(driver, INFRASTRUCTURE_FIELDS_SELECTOR);
            assertThat(keyValueMap.get(NAMESPACE_FIELD_SELECTOR)).isEqualTo(NAMESPACE);
            assertThat(keyValueMap.get(CLUSTER)).isEqualTo(EXTERNAL_CLUSTER);
            fillOutWizardValue(driver, RESOURCE_INSTANCE_NAME_FIELD_SELECTOR, RESOURCE_NAME_TOO_LONG_TEXT);
            assertThat(querySelect(driver, GENERAL_ATTRIBUTES_SELECTOR).getText()).contains(ERROR_TEXT_TOO_LONG_RESOURCE_NAME);
            fillOutWizardValue(driver, RESOURCE_INSTANCE_NAME_FIELD_SELECTOR, RESOURCE_NAME_VALID_TEXT);
            assertThat(querySelect(driver, GENERAL_ATTRIBUTES_SELECTOR).getText()).contains(ERROR_TEXT_TOO_LONG_RESOURCE_NAME);
            checkCheckboxNotExistForInstantiateOperation(driver, PERSIST_SCALE_INFO_CHECKBOX_SELECTOR);
            checkCheckboxNotExistForInstantiateOperation(driver, SKIP_MERGING_PREVIOUS_VALUES_SELECTOR);

            LOGGER.info("Selecting the instantiation scale level");
            WebElement instantiationDropdown = querySelect(driver, INSTANTIATION_LEVEL_DROPDOWN);
            scrollIntoView(driver, instantiationDropdown);
            selectFromDropdown(driver, INSTANTIATION_LEVEL_ID, INSTANTIATION_LEVEL_DROPDOWN_MENU_SELECTOR, RADIO_BUTTON_SELECTOR, instantiationDropdown);
            WebElement selectedInstantiationLevelId = querySelect(driver, INSTANTIATION_LEVEL_DROPDOWN_SELECTED);
            assertThat(selectedInstantiationLevelId.getText()).isEqualTo(INSTANTIATION_LEVEL_ID);

            LOGGER.info("Selecting the dynamic scale Level");
            CommonSteps.clickRadioButton(driver, DYNAMIC_SCALE_LEVEL_SELECTOR);
            var payloadInput = querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_ASPECT_ID, SCALE_LEVEL_INPUT_SELECTOR));
            assertThat(payloadInput.getAttribute(VALUE)).isEqualTo("4");
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_ASPECT_ID, SCALE_LEVEL_TITLE_SELECTOR)).getText())
                    .isEqualTo(PAYLOAD_ASPECT_LABEL);
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_ASPECT_ID, SCALE_LEVEL_MESSAGE_SELECTOR)).getText())
                    .isEqualTo(PAYLOAD_MESSAGE);
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_ASPECT_ID, VALIDATION_ICON)).getAttribute(NAME))
                    .isEqualTo(VALIDATION_SUCCESS);

            var payload2Input = querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_2_ASPECT_ID, SCALE_LEVEL_INPUT_SELECTOR));
            assertThat(payload2Input.getAttribute(VALUE)).isEqualTo("0");
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_2_ASPECT_ID, SCALE_LEVEL_TITLE_SELECTOR)).getText())
                    .isEqualTo(PAYLOAD_2_ASPECT_LABEL);
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_2_ASPECT_ID, SCALE_LEVEL_MESSAGE_SELECTOR)).getText())
                    .isEqualTo(PAYLOAD_2_MESSAGE);
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_2_ASPECT_ID, VALIDATION_ICON)).getAttribute(NAME))
                    .isEqualTo(VALIDATION_SUCCESS);

            LOGGER.info("Checking wrong inputs");
            fillOutWizardValue(driver, PAYLOAD_ASPECT_ID, "-1");
            fillOutWizardValue(driver, PAYLOAD_2_ASPECT_ID, "7");
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_ASPECT_ID, VALIDATION_ICON)).getAttribute(NAME))
                    .isEqualTo(VALIDATION_FAILED);
            assertThat(querySelect(driver, String.format(SCALE_LEVEL_FORMATTER, PAYLOAD_2_ASPECT_ID, VALIDATION_ICON)).getAttribute(NAME))
                    .isEqualTo(VALIDATION_FAILED);

            LOGGER.info("Selecting the instantiation scale Level");
            CommonSteps.clickRadioButton(driver, INSTANTIATION_SCALE_LEVEL_SELECTOR);
            instantiationDropdown = querySelect(driver, INSTANTIATION_LEVEL_DROPDOWN);
            scrollIntoView(driver, instantiationDropdown);
            selectFromDropdown(driver, INSTANTIATION_LEVEL_ID, INSTANTIATION_LEVEL_DROPDOWN_MENU_SELECTOR, RADIO_BUTTON_SELECTOR, instantiationDropdown);

            LOGGER.info("Selecting the extensions");
            CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, ASPECT_PAYLOAD_2_CISM_CONTROLLED_ID, ASPECT_PAYLOAD_2_MANUAL_CONTROLLED_ID);
            CommonSteps.clickRadioButton(driver, ASPECT_PAYLOAD_2_MANUAL_CONTROLLED_ID);
            CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, ASPECT_PAYLOAD_2_MANUAL_CONTROLLED_ID, ASPECT_PAYLOAD_2_CISM_CONTROLLED_ID);

            LOGGER.info("Select deployable modules");
            clickDisableRadioButtonsForAllDeployableModules(driver);
            clickEnableRadioButtonForThirdDeployableModule(driver);

            manualSleep(300);
            clickOnTheButton(driver, NEXT_BUTTON);
            assertThat(querySelect(driver, WIZARD_STEP_SELECTED_TITLE).getText()).isEqualTo(ADDITIONAL_ATTRIBUTES);

            LOGGER.info("Instantiate Step 4 - Additional attributes");
            Map<String, String> expectedResultsMapForInstantiation = getAdditionalAttributesValuesFromAdditionalAttributesStep(driver);
            fillOutWizardValue(driver, "server.service.clusterIP", "127.0.0.1");
            fillOutWizardValue(driver, "server.service.loadBalancerIP", "127.0.0.2");
            validateMultiSecret(driver, querySelect(driver, NEXT_BUTTON));
            manualSleep(300);
            clickOnTheButton(driver, NEXT_BUTTON);

            LOGGER.info("Instantiate Step 5 - Summary");
            assertThat(querySelect(driver, WIZARD_STEP_SELECTED_TITLE).getText()).isEqualTo(SUMMARY);
            assertThat(querySelect(driver, CLUSTER_SUMMARY_INFO_SELECTOR).getAttribute("title").equals(EXTERNAL_CLUSTER)).isTrue();
            Map<String, String> actualAttributes = getAdditionalAttributes(driver);
            expectedResultsMapForInstantiation.forEach((key, value) -> {
                LOGGER.info("Key value pair: {}, {}", key, value);
                assertThat(actualAttributes.containsKey(key)).isTrue();
                assertThat(actualAttributes.get(key)).isEqualTo(value);
            });

            final Map<String, String> expectedDeployableModules = getExpectedDeployableModules();
            final Map<String, String> deployableModulesFromSummaryStep = getDeployableModulesFromSummaryStep(driver);
            expectedDeployableModules.forEach((key, value) -> {
                LOGGER.info("Key value pair: {}, {}", key, value);
                assertThat(deployableModulesFromSummaryStep.containsKey(key)).isTrue();
                assertThat(deployableModulesFromSummaryStep.get(key)).isEqualTo(value);
            });
            clickOnTheButton(driver, FINISH_BUTTON);

            LOGGER.info("Waiting for the window to appear");
            waitForElementWithText(driver, INSTANTIATE_OPERATION_STARTED_DIALOG_SELECTOR, INSTANTIATE_OPERATION_STARTED_DIALOG_TEXT, 20000, 2000);
            querySelect(driver, SEE_RESOURCE_LIST_BUTTON_SELECTOR).click();

            LOGGER.info("checking that the Test is concluded");
            assertThat(driver.getCurrentUrl()).contains(RESOURCES_URL_PART);
        } catch (Throwable e) {
            takeScreenshot(driver, "InstantiateWizard_" + version + System.currentTimeMillis() + ".png");
            throw e;
        }
    }

    private static void checkCheckboxNotExistForInstantiateOperation(RemoteWebDriver driver, String selector) {
        WebElement checkbox = querySelect(driver, selector);
        assertThat(checkbox).isNull();
    }
}
