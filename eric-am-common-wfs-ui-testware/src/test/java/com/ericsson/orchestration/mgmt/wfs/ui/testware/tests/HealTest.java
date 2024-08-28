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

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.io.IOException;
import java.time.Duration;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.*;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ENTRY_SCHEMA_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.HEAL;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_JSON_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.LIST_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MAP_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_LIST_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_MAP_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_FAILED_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_7_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_MAP_VALUE;
import static org.assertj.core.api.Assertions.assertThat;

public class HealTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(HealTest.class);
    private static final String HEAL_PREFIX = "#Heal__";
    private static final String CAUSES_NOT_PRESENT_DIALOG_SELECTOR = "eui-base-v0-dialog[label=\"Causes Not Present\"]";
    private static final String CAUSES_NOT_PRESENT_OK_BUTTON_SELECTOR = "eui-base-v0-button[slot=\"bottom\"]";
    private static final String CONFIRM_HEAL_BUTTON_SELECTOR = "eui-base-v0-button#heal-perform-button";
    private static final String DISABLED = "disabled";

    @Test(dataProvider = "driver")
    public void verifyHealUI(String version, RemoteWebDriver driver)throws IOException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadResources(driver);

            LOGGER.info("Clicking context menu and checking heal option not present for resource one");
            checkContextMenuOptionNotPresentForResource(driver, RESOURCE_1_ID, HEAL_PREFIX);


            LOGGER.info("Checking invalid heal pop up is returned for package without causes defined");
            clickContextMenuItem(driver, wait, RESOURCE_2_FAILED_CONTEXT_MENU_SELECTOR, HEAL);
            LOGGER.info("Checking causes not present dialog");
            WebElement dialog = querySelect(driver, CAUSES_NOT_PRESENT_DIALOG_SELECTOR);
            assertThat(dialog).isNotNull();
            waitForElementWithText(driver, "div[class=\"dialog__title\"]", "Causes Not Present");
            LOGGER.info("Checking causes not present dialog button");
            WebElement invalidHealOkButton = querySelect(driver, CAUSES_NOT_PRESENT_OK_BUTTON_SELECTOR);
            assertThat(invalidHealOkButton).isNotNull();
            invalidHealOkButton.click();

            LOGGER.info("Clicking context menu and checking heal option is present for resource two");
            clickContextMenuItem(driver, wait, RESOURCE_2_CONTEXT_MENU_SELECTOR, HEAL);
            WebElement healButton = querySelect(driver, CONFIRM_HEAL_BUTTON_SELECTOR);
            validateComplexTypeAdditionalAttributes(driver, healButton);
            validateCauseDropDownNotValidIfEmpty(driver, healButton);
            validateApplicationTimeout(driver, wait, healButton);
            validateRestoreAttributes(driver, wait, healButton);
            validateMultiSecret(driver, healButton);
            confirmHeal(driver, wait, healButton);

            LOGGER.info("Clicking context menu and checking heal option is present for resource seven");
            clickContextMenuItem(driver, wait, RESOURCE_7_CONTEXT_MENU_SELECTOR, HEAL);
            healButton = querySelect(driver, CONFIRM_HEAL_BUTTON_SELECTOR);
            validateCauseDropDownNotValidIfEmpty(driver, healButton);
            validateSecretAttributes(driver);
            confirmHeal(driver, wait, healButton);
        } catch (Exception e) {
            takeScreenshot(driver, "verifyHeal_" + version + ".png");
            throw e;
        }
    }

    private static void validateCauseDropDownNotValidIfEmpty(RemoteWebDriver driver, WebElement healButton) {
        LOGGER.info("Checking heal button not valid until Full Restore cause selected");
        assertThat(healButton.getAttribute(DISABLED)).isNotNull();
        WebElement causeDropDown = querySelect(driver, "#cause-combo-box");
        scrollIntoView(driver, causeDropDown);
        causeDropDown.click();
        assertThat(causeDropDown).isNotNull();
        waitForElementWithText(driver, "div[menu-item]", "Full Restore").click();
        assertThat(healButton.getAttribute(DISABLED)).isNull();
    }

    private static void validateComplexTypeAdditionalAttributes(final RemoteWebDriver driver, final WebElement nextButton) {
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_LIST_VALUE, nextButton,
                                                         ENTRY_SCHEMA_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_LIST_VALUE, nextButton,
                                                         INVALID_JSON_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, "", nextButton, INVALID_JSON_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, nextButton,
                                                         NOT_LIST_TYPE_ERROR_TEXT, false);

        LOGGER.info("Set correct values into list type fields");
        checkFillingComplexAddAttributeWithValidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, nextButton);

        LOGGER.info("Set incorrect values into map type fields");
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_MAP_VALUE, nextButton,
                                                         ENTRY_SCHEMA_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_MAP_VALUE, nextButton,
                                                         INVALID_JSON_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, "", nextButton, INVALID_JSON_ERROR_TEXT, false);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, nextButton,
                                                         NOT_MAP_TYPE_ERROR_TEXT, false);

        LOGGER.info("Set correct values into map type fields");
        checkFillingComplexAddAttributeWithValidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, nextButton);
    }
}
