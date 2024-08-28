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

import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

import java.time.Duration;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementContainingText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.COMPLETED_DELETE_PACKAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DELETE_PACKAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES;

public class PackageTests extends UITest {

    @Test(dataProvider = "driver")
    public void deletePackage(String version, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        driver.manage().window().maximize();
        loadApplication(PACKAGES, driver);
        clickContextMenuItem(driver, wait, ".custom-table__cell #row-d3def1ce-4cf4-477c-aab3-21cb04e6a386", DELETE_PACKAGE);
        wait.until(item -> querySelect(driver, "eui-base-v0-dialog").isDisplayed());
        String deleteDialogButton = "eui-base-v0-button[warning]";
        querySelect(driver, deleteDialogButton).click(); // click delete button in dialog
        // waitForElementContainingText(driver, "eui-base-v0-notification", COMPLETED_DELETE_PACKAGE); // get notification
    }
}
