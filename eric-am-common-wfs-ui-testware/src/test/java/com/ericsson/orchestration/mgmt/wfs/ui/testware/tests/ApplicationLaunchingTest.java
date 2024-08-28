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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.manualSleep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CISM_CLUSTERS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.USER_ADMINISTRATION;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.Test;

import java.util.ArrayList;

public class ApplicationLaunchingTest extends UITest {

    @Test(dataProvider = "driver")
    public void applicationLoadsSuccessfully(String version, RemoteWebDriver driver) {
        loadApplication(RESOURCES, driver);
        driver.manage().window().maximize();
        querySelect(driver, "#main-panel-title");
        WebElement mainHeading = querySelect(driver, "#main-panel-title");
        assertThat(mainHeading.getText()).isEqualTo(RESOURCES);

        WebElement leftAppFlyoutButton = querySelect(driver, ".actions-left");
        leftAppFlyoutButton.click();
        manualSleep(100);

        ArrayList<WebElement> listOfApplications = querySelectAll(driver, "eui-base-v0-tree-item");
        assertThat(listOfApplications).hasSize(5);
        ArrayList<String> applicationNames = new ArrayList<>();
        for (WebElement webElement : listOfApplications) {
            applicationNames.add(webElement.getText());
        }
        assertThat(applicationNames).containsExactlyInAnyOrder(RESOURCES, PACKAGES, OPERATIONS, CISM_CLUSTERS, USER_ADMINISTRATION);
    }
}
