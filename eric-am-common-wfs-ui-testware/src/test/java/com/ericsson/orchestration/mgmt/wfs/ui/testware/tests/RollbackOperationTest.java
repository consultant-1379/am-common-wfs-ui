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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS_8_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ROLLBACK;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class RollbackOperationTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(RollbackOperationTest.class);
    private static final String ROLLBACK_RES8_MENU_SELECTOR = ".custom-table__cell #" + OPERATIONS_8_ID;
    private static final String ROLLBACK_BUTTON_ID = "#Rollback";

    @Test(dataProvider = "driver")
    public void testRollback(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadApplication(OPERATIONS, driver);
            driver.manage().window().maximize();
            waitForElementWithText(driver, "div[column=vnfInstanceName]", "instance-8");

            clickContextMenuItem(driver, wait, ROLLBACK_RES8_MENU_SELECTOR, ROLLBACK);

            LOGGER.info("Verify that the rollback dialog is displayed");
            WebElement rollbackButton = querySelect(driver, ROLLBACK_BUTTON_ID);
            assertThat(querySelect(driver, ROLLBACK_BUTTON_ID)).isNotNull();

            LOGGER.info("Click the rollback button, verify notification is displayed");
            rollbackButton.click();
            WebElement confirmForceFail = querySelect(driver, ".notification");
            assertThat(confirmForceFail.isDisplayed()).isTrue();
        } catch (Exception e) {
            takeScreenshot(driver, "RollbackOperationTest_" + version + ".png");
            throw e;
        }
    }
}
