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
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SCALE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.typeText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.validateApplicationTimeout;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class ScaleTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScaleTest.class);
    private static final String SCALE_OUT_RADIO_BUTTON_ID = "#scale-type-scale-out";
    private static final String INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR = ".errorMessage.steps-to-scale.invalidScaleSteps";
    private static final String CHECKED = "checked";
    private static final String DISABLED = "disabled";
    private static final String SCALE_PREFIX = "#Scale__";

    @Test(dataProvider = "driver")
    public void verifyScaleUI(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadResources(driver);

            LOGGER.info("Checking scale option not present for resource two");
            checkContextMenuOptionNotPresentForResource(driver, RESOURCE_2_ID, SCALE_PREFIX);

            LOGGER.info("Clicking context menu and checking for presence of scale option for resource one");
            clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, SCALE);

            LOGGER.info("Verify that the scale out option is selected");
            assertThat(querySelect(driver, SCALE_OUT_RADIO_BUTTON_ID).getAttribute(CHECKED)).isNotNull().contains("true");
            WebElement scaleButton = querySelect(driver, ".scale-perform-button");
            assertThat(scaleButton.getAttribute(DISABLED)).isEqualTo("true");

            LOGGER.info("Select the scaling aspect, running");
            querySelect(driver, "#aspectId-combo-box").click();
            waitForElementWithText(driver, "div[menu-item]", "Running (running)").click();
            assertThat(scaleButton.getAttribute(DISABLED)).isNull();

            LOGGER.info("Set a negative value, verify error message");
            WebElement stepsToScaleTextBox = querySelect(driver, "#steps-to-scale");
            stepsToScaleTextBox.click();
            typeText(driver, Keys.BACK_SPACE.toString(), "-2");
            assertThat(querySelect(driver,
                                   INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).matches("Steps to scale is not a valid positive number, please enter a valid number");
            assertThat(scaleButton.getAttribute(DISABLED)).isEqualTo("true");

            stepsToScaleTextBox.click();
            LOGGER.info("Set a value one outside the boundary, verify the error message");
            typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "8");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).matches(
                    "Steps to scale must be less than or equal to 7");
            assertThat(scaleButton.getAttribute(DISABLED)).isEqualTo("true");

            LOGGER.info("Set a value one inside the boundary, verify no error message");
            typeText(driver , Keys.BACK_SPACE.toString(), "6");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).isEmpty();
            assertThat(scaleButton.getAttribute(DISABLED)).isNull();

            stepsToScaleTextBox.click();
            LOGGER.info("Set a value at the boundary, verify no error message");
            typeText(driver, Keys.BACK_SPACE.toString(), "7");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).isEmpty();
            assertThat(scaleButton.getAttribute(DISABLED)).isNull();

            LOGGER.info("Click scale In");
            WebElement scaleIn = querySelect(driver, "#scale-type-scale-in");
            scaleIn.click();
            assertThat(scaleIn.getAttribute(CHECKED)).isNotNull().contains("true");
            WebElement scaleOut = querySelect(driver, SCALE_OUT_RADIO_BUTTON_ID);
            assertThat(scaleOut.getAttribute(CHECKED)).isNull();

            stepsToScaleTextBox.click();
            LOGGER.info("Set a value one outside the boundary, verify the error message");
            typeText(driver, Keys.BACK_SPACE.toString(), "4");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).matches("Steps to scale must be less than or "
                                                                                                                  + "equal to 3");
            assertThat(scaleButton.getAttribute(DISABLED)).isEqualTo("true");

            stepsToScaleTextBox.click();
            LOGGER.info("Set a value one inside the boundary, verify no error message");
            typeText(driver, Keys.BACK_SPACE.toString(), "2");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).isEmpty();
            assertThat(scaleButton.getAttribute(DISABLED)).isNull();

            stepsToScaleTextBox.click();
            LOGGER.info("Set a value at the boundary, verify no error message");
            typeText(driver, Keys.BACK_SPACE.toString(), "3");
            assertThat(querySelect(driver, INVALID_SCALE_STEPS_ERROR_MESSAGE_SELECTOR).getText()).isEmpty();
            assertThat(scaleButton.getAttribute(DISABLED)).isNull();

            validateApplicationTimeout(driver, wait, scaleButton);

            LOGGER.info("Click the scale button");
            scaleButton.click();
            WebElement confirmScale = querySelect(driver, "#scale-confirmation");

            LOGGER.info("Confirm scale");
            wait.until(ExpectedConditions.elementToBeClickable(confirmScale));
            confirmScale.click();

        } catch(Exception e) {
            takeScreenshot(driver, "verifyScale_" + version + ".png");
            throw e;
        }

    }
}
