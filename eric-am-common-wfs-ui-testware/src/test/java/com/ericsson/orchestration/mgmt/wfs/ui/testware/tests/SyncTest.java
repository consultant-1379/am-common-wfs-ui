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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearInputField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickDialogButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.typeText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SYNC;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class SyncTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(SyncTest.class);
    private static final String SYNC_BUTTON_SELECTOR = ".btn.primary";
    private static final String TIMEOUT_SELECTOR = "eui-base-v0-text-field[id=sync-timeout]";
    private static final String DISABLED_ATTR = "disabled";

    @Test(dataProvider = "driver")
    public void testSyncResource(String version, RemoteWebDriver driver) {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        loadApplication(RESOURCES, driver);

        driver.manage().window().maximize();
        waitForElementWithText(driver, "div[column=vnfInstanceName]", "test-instance");

        LOGGER.info("Clicking context menu and checking sync option present for resource 2");
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, SYNC);

        LOGGER.info("Verify that the sync dialog is displayed");
        assertThat(querySelect(driver, SYNC_BUTTON_SELECTOR)).isNotNull();

        LOGGER.info("Set a negative value for application timeout, verify error");
        clearInputField(driver, TIMEOUT_SELECTOR);

        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "-5");
        WebElement syncButton = waitForElementWithText(driver, "eui-base-v0-button", "Sync");
        assertThat(syncButton.getAttribute(DISABLED_ATTR)).isEqualTo("true");

        LOGGER.info("Set a text value for application timeout, verify error");
        clearInputField(driver, TIMEOUT_SELECTOR);
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "abc");
        assertThat(syncButton.getAttribute(DISABLED_ATTR)).isEqualTo("true");

        LOGGER.info("Set no value for application timeout");
        clearInputField(driver, TIMEOUT_SELECTOR);
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "");
        assertThat(syncButton.getAttribute(DISABLED_ATTR)).isEqualTo(null);

        LOGGER.info("Set a valid value for application timeout");
        clearInputField(driver, TIMEOUT_SELECTOR);
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "100");
        assertThat(syncButton.getAttribute(DISABLED_ATTR)).isEqualTo(null);

        LOGGER.info("Selecting Sync button");
        clickDialogButton(driver, "Sync");

        LOGGER.info("Checking Sync notification is displayed");
        WebElement modificationInProgress = querySelect(driver, ".notification");
        assertThat(modificationInProgress.isDisplayed()).isTrue();
    }
}