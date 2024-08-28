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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkContextMenuOptionNotPresentForResource;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadResources;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLEAN_UP;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_FAILED_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_ID;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class CleanUpTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(CleanUpTest.class);
    private static final String CLEAN_UP_BUTTON_ID = "#Cleanup";

    private static final String DISABLED = "disabled";
    private static final String CLEAN_UP_PREFIX = "#Clean-up__";

    @Test(dataProvider = "driver")
    public void verifyCleanUpUI(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadResources(driver);

            LOGGER.info("Checking clean up option is not present for resource one");
            checkContextMenuOptionNotPresentForResource(driver, RESOURCE_1_ID, CLEAN_UP_PREFIX);

            LOGGER.info("Clicking context menu and checking for presence of clean up option for resource three");
            clickContextMenuItem(driver, wait, RESOURCE_1_FAILED_CONTEXT_MENU_SELECTOR, CLEAN_UP);

            LOGGER.info("Verify that the clean up dialog is displayed");
            WebElement cleanUpButton = querySelect(driver, CLEAN_UP_BUTTON_ID);
            assertThat(querySelect(driver, CLEAN_UP_BUTTON_ID)).isNotNull();

            LOGGER.info("Set a negative value for application timeout, verify error");
            WebElement applicationTimeout = querySelect(driver, "#applicationTimeOut");
            applicationTimeout.click();
            typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "-5");
            assertThat(cleanUpButton.getAttribute(DISABLED)).isEqualTo("true");

            LOGGER.info("Set a text value for application timeout, verify error");
            applicationTimeout.click();
            typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "abc");
            assertThat(cleanUpButton.getAttribute(DISABLED)).isEqualTo("true");

            LOGGER.info("Set a valid value for application timeout, verify error");
            applicationTimeout.click();
            typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "100");
            assertThat(cleanUpButton.getAttribute(DISABLED)).isEqualTo(null);

            LOGGER.info("Click the clean up button, verify notification is displayed");
            cleanUpButton.click();
            WebElement confirmCleanUp = querySelect(driver, ".notification");
            assertThat(confirmCleanUp.isDisplayed());

        } catch (Exception e) {
            takeScreenshot(driver, "verifyCleanUp_" + version + ".png");
            throw e;
        }
    }

    private static void typeText(final RemoteWebDriver driver, final String... characters) {
        Actions stepsToCleanUp = new Actions(driver);
        stepsToCleanUp.sendKeys(characters);
        stepsToCleanUp.perform();
    }
}
