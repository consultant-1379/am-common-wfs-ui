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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBreadCrumb;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.getScaleLevels;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GO_TO_DETAILS_PAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_ID;

import java.time.Duration;
import java.util.Map;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class SuccessResourceDetailsOperationTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(SuccessResourceDetailsOperationTest.class);
    private static final String SUCCESS_RES1_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_1_ID;
    private static final String FAILED_RES2_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_2_ID;
    private static final String RESOURCE_OPERATIONS_TAB_SELECTOR = "eui-layout-v0-tabs " + "eui-layout-v0-tab#resourceOperations";
    private static final String RUNNING_SCALE_LEVEL = "Running Scale Level";
    private static final String DATABASE_SCALE_LEVEL = "Database Scale Level";
    private static final String PROCESSING_SCALE_LEVEL = "Processing Scale Level";

    @Test(dataProvider = "driver")
    public void testResourceDetails(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadApplication(RESOURCES, driver);
            driver.manage().window().maximize();

            LOGGER.info("Click go to page for resource 1 with scaling data");
            clickContextMenuItem(driver, wait, SUCCESS_RES1_MENU_SELECTOR, GO_TO_DETAILS_PAGE);

            LOGGER.info("Checking that ResourceOperations screen is displayed correctly");
            wait.until(item -> querySelect(driver, RESOURCE_OPERATIONS_TAB_SELECTOR).isDisplayed());
            WebElement resourceOperationsTab = querySelect(driver, RESOURCE_OPERATIONS_TAB_SELECTOR);
            assertThat(resourceOperationsTab).isNotNull();

            LOGGER.info("Checking scale levels");
            Map<String, String> scaleLevels = getScaleLevels(driver);
            assertThat(scaleLevels).isNotEmpty()
                .containsEntry(RUNNING_SCALE_LEVEL, "3")
                .containsEntry(DATABASE_SCALE_LEVEL, "1")
                .containsEntry(PROCESSING_SCALE_LEVEL, "4");

            clickBreadCrumb(driver, wait,"resources");
            LOGGER.info("Click go to page for resource 2 without scaling data");
            clickContextMenuItem(driver, wait, FAILED_RES2_MENU_SELECTOR, GO_TO_DETAILS_PAGE);

            LOGGER.info("Checking that ResourceOperations screen is displayed correctly");
            wait.until(item -> querySelect(driver, RESOURCE_OPERATIONS_TAB_SELECTOR).isDisplayed());
            resourceOperationsTab = querySelect(driver, RESOURCE_OPERATIONS_TAB_SELECTOR);
            assertThat(resourceOperationsTab).isNotNull();

            LOGGER.info("Checking scale levels");
            scaleLevels = getScaleLevels(driver);
            assertThat(scaleLevels).isEmpty();
        } catch (Exception e) {
            takeScreenshot(driver, "RollbackResourceDetailsOperationTest_" + version + ".png");
            throw e;
        }
    }
}
