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
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementContainingText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GO_TO_DETAILS_PAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_8_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ROLLBACK;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class RollbackResourceDetailsOperationTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(RollbackResourceDetailsOperationTest.class);
    private static final String ROLLBACK_RES8_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_8_ID;
    private static final String RESORUCE_OPERATIONS_TAB_SELECTOR =
            "eui-layout-v0-tabs " + "eui-layout-v0-tab#resourceOperations";
    private static final String ROLLBACK_BUTTON_ID = "#Rollback";

    @Test(dataProvider = "driver")
    public void testRollback(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadApplication(RESOURCES, driver);
            driver.manage().window().maximize();

            LOGGER.info("Click go to page for resource 8");
            clickContextMenuItem(driver, wait, ROLLBACK_RES8_MENU_SELECTOR, GO_TO_DETAILS_PAGE);

            LOGGER.info("Checking that ResourceOperations screen is displayed correctly");
            wait.until(item -> querySelect(driver, RESORUCE_OPERATIONS_TAB_SELECTOR).isDisplayed());
            WebElement resourceOperationsTab = querySelect(driver, RESORUCE_OPERATIONS_TAB_SELECTOR);
            assertThat(resourceOperationsTab).isNotNull();
            resourceOperationsTab.click();

            waitForElementContainingText(driver, ".customMainPanelInfo", "Operation History");

            clickContextMenuItem(driver, wait, ROLLBACK_RES8_MENU_SELECTOR, ROLLBACK);

            LOGGER.info("Verify that the rollback dialog is displayed");
            WebElement rollbackButton = querySelect(driver, ROLLBACK_BUTTON_ID);
            assertThat(querySelect(driver, ROLLBACK_BUTTON_ID)).isNotNull();

            LOGGER.info("Click the rollback button, verify notification is displayed");
            rollbackButton.click();
            WebElement confirmForceFail = querySelect(driver, ".notification");
            assertThat(confirmForceFail.isDisplayed()).isTrue();
        } catch (Exception e) {
            takeScreenshot(driver, "RollbackResourceDetailsOperationTest_" + version + ".png");
            throw e;
        }
    }
}
