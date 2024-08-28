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

import java.time.Duration;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkFillingComplexAddAttributeWithInvalidValues;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkFillingComplexAddAttributeWithValidValues;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.scrollIntoView;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.validateSecretAttributes;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementContainingText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ENTRY_SCHEMA_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_JSON_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.LIST_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MAP_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_LIST_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_MAP_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_4_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_5_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ROLLBACK;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_MAP_VALUE;

import static org.assertj.core.api.Assertions.assertThat;

public class RollbackResourceTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(RollbackResourceTest.class);
    private static final String ROLLBACK_OPTION_SELECTOR = "#Rollback__";
    private static final String ROLLBACK_OPTION_RES4_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_4_ID;
    private static final String ROLLBACK_OPTION_RES5_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_5_ID;
    private static final String ROLLBACK_DIALOG_SELECTOR = "eui-base-v0-dialog[label=Rollback]";
    private static final String ROLLBACK_DIALOG_TEXT_SELECTOR = ROLLBACK_DIALOG_SELECTOR + " div[slot=content]";
    private static final String ROLLBACK_BUTTON_SELECTOR = "#rollback";
    private static final String CANCEL_BUTTON_SELECTOR = "#cancel-rollback";
    private static final String CLOSE_BUTTON_NO_VERSION_SELECTOR = "eui-base-v0-button[slot=\"bottom\"]";
    private static final String NOTIFICATION_SELECTOR = "eui-base-v0-notification";

    private static final String ROLLBACK_PAGE = "e-resource-rollback";
    private static final String ROLLBACK_NOTIFICATION_MESSAGE = "Rollback operation has started";

    private static final String ROLLBACK_NO_TARGET_PACKAGE_TEXT = "Downgrade not supported for instance id package-details-deleted-for-downgrade as"
            + " the target downgrade package is no longer available";

    @Test(dataProvider = "driver")
    public void testDowngradeResource(String version, RemoteWebDriver driver) {
        try {

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadApplication(RESOURCES, driver);
            driver.manage().window().maximize();

            LOGGER.info("Checking successful downgrade on the resource downgrade-test-valid");
            LOGGER.info("Checking rollback option is present for resource downgrade-test-valid");
            clickContextMenuItem(driver, wait, ROLLBACK_OPTION_RES4_MENU_SELECTOR, ROLLBACK);

            LOGGER.info("Checking that Rollback Page is displayed correctly");
            wait.until(item -> querySelect(driver, ROLLBACK_PAGE).isDisplayed());
            WebElement rollbackButton = querySelect(driver, ROLLBACK_BUTTON_SELECTOR);
            assertThat(rollbackButton).isNotNull();
            WebElement cancelButton = querySelect(driver, CANCEL_BUTTON_SELECTOR);
            assertThat(cancelButton).isNotNull();

            LOGGER.info("Setting Parameters and executing rollback");
            validateSecretAttributes(driver);

            checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_LIST_VALUE, rollbackButton,
                                                             ENTRY_SCHEMA_ERROR_TEXT, false);
            checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_LIST_VALUE, rollbackButton,
                                                             INVALID_JSON_ERROR_TEXT, false);
            checkFillingComplexAddAttributeWithInvalidValues(driver,
                                                             LIST_TYPE_ADD_ATTRIBUTE_SELECTOR,
                                                             "",
                                                             rollbackButton,
                                                             INVALID_JSON_ERROR_TEXT,
                                                             false);
            checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, rollbackButton,
                                                             NOT_LIST_TYPE_ERROR_TEXT, false);

            LOGGER.info("Set correct values into list type fields");
            checkFillingComplexAddAttributeWithValidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, rollbackButton);

            LOGGER.info("Set incorrect values into map type fields");
            checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_MAP_VALUE, rollbackButton,
                                                             ENTRY_SCHEMA_ERROR_TEXT, false);
            checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_MAP_VALUE, rollbackButton,
                                                             INVALID_JSON_ERROR_TEXT, false);
            checkFillingComplexAddAttributeWithInvalidValues(driver,
                                                             MAP_TYPE_ADD_ATTRIBUTE_SELECTOR,
                                                             "",
                                                             rollbackButton,
                                                             INVALID_JSON_ERROR_TEXT,
                                                             false);
            checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, rollbackButton,
                                                             NOT_MAP_TYPE_ERROR_TEXT, false);

            LOGGER.info("Set correct values into map type fields");
            checkFillingComplexAddAttributeWithValidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, rollbackButton);
            scrollIntoView(driver, rollbackButton);
            rollbackButton.click();

            LOGGER.info("Checking that Rollback notification operation has started");
            waitForElementContainingText(driver, NOTIFICATION_SELECTOR, ROLLBACK_NOTIFICATION_MESSAGE);

            LOGGER.info("Checking that Rollback page is closed");
            assertThat(querySelect(driver, ROLLBACK_PAGE)).isNull();

            LOGGER.info("Checking that rollback operation can be cancelled");
            clickContextMenuItem(driver, wait, ROLLBACK_OPTION_RES4_MENU_SELECTOR, ROLLBACK);
            wait.until(item -> querySelect(driver, ROLLBACK_PAGE).isDisplayed());
            cancelButton = querySelect(driver, CANCEL_BUTTON_SELECTOR);
            scrollIntoView(driver, cancelButton);
            cancelButton.click();
            assertThat(querySelect(driver, ROLLBACK_DIALOG_SELECTOR)).isNull();

            LOGGER.info(
                    "Checking rollback option is not present for resource 2 - when there is no previous upgrade or there is no target vnfd in the "
                            + "db, that is why downgradeSupported value is false");
            openContextMenu(driver, RESOURCE_2_ID);
            WebElement rollbackOption2 = querySelect(driver, ROLLBACK_OPTION_SELECTOR + RESOURCE_2_ID);
            assertThat(rollbackOption2).isNull();
            closeContextMenu(driver);

            LOGGER.info("Checking rollback option is not present for resource dowgrade-test-package-deleted - when there is no target package");
            clickContextMenuItem(driver, wait, ROLLBACK_OPTION_RES5_MENU_SELECTOR, ROLLBACK);

            LOGGER.info("Checking that Rollback dialog screen is displayed correctly when there is no target package");
            wait.until(item -> querySelect(driver, ROLLBACK_DIALOG_SELECTOR).isDisplayed());
            WebElement closeButton = querySelect(driver, CLOSE_BUTTON_NO_VERSION_SELECTOR);
            assertThat(querySelect(driver, ROLLBACK_DIALOG_TEXT_SELECTOR).getText()).isEqualToIgnoringNewLines(ROLLBACK_NO_TARGET_PACKAGE_TEXT);
            closeButton.click();
            assertThat(querySelect(driver, ROLLBACK_DIALOG_SELECTOR)).isNull();
        } catch (Exception e) {
            takeScreenshot(driver, "rollback_resource_" + version + ".png");
            throw e;
        }
    }
}