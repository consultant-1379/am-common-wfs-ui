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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkRowSelected;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnInfoIcon;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadResources;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyFlyoutIsHidden;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openBackupsTabInSidePanel;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.TABLE_ROW_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.PackageListTest.clickFullTableRow;
import static org.assertj.core.api.Assertions.assertThat;

public class SidePanelBackupsListTest extends UITest {
    private static final Logger LOGGER = LoggerFactory.getLogger(BackupsListTest.class);
    private static final String RESOURCES_TABLE_SELECTOR = "resourcesTable";
    private static final String SIDE_PANEL_BACKUPS_SELECTOR = ".timeline ul li";
    private static final String TABLE_ROW = "3";
    private static final int BACKUPS_COUNT = 3;
    private static final String SIDE_PANEL_RESOURCE_NAME_SELECTOR = "#details .tile__header__left__subtitle";
    private static final String SIDE_PANEL_GENERAL_INFORMATION_SELECTOR = "e-resource-details-panel eui-layout-v0-tabs eui-layout-v0-tab";

    @Test(dataProvider = "driver")
    public void sidePanelBackupsFlow(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));

            LOGGER.info("Loading resources");
            loadResources(driver);
            driver.manage().window().maximize();

            LOGGER.info("Selecting first row in RESOURCES table and verifying the selection");
            clickFullTableRow(RESOURCES_TABLE_SELECTOR, TABLE_ROW, driver);
            wait.until(item -> checkRowSelected(TABLE_ROW, false, driver));

            LOGGER.info("Verifying side-panel is closed and clicking on the info icon to open side-panel,");
            verifyFlyoutIsHidden(driver);
            clickOnInfoIcon(driver);
            verifyFlyoutContentForTableRow(TABLE_ROW, driver);

            LOGGER.info("Opening the backups tab in side-panel");
            openBackupsTabInSidePanel(driver);

            LOGGER.info("Check count of displayed backups in side-panel");
            assertThat(querySelectAll(driver, SIDE_PANEL_BACKUPS_SELECTOR).size()).isEqualTo(BACKUPS_COUNT);

        } catch (Exception e) {
            takeScreenshot(driver, "SidePanelBackupsListTest_" + version);
            throw e;
        }
    }

    private static void verifyFlyoutContentForTableRow(String tableRow, RemoteWebDriver driver) {
        String resourceName = verifyResourceNameForRow(tableRow, driver);

        WebElement resourceDetails = querySelect(driver, SIDE_PANEL_GENERAL_INFORMATION_SELECTOR);
        assertThat(resourceDetails).isNotNull();

        WebElement flyoutResourceName = querySelect(driver, SIDE_PANEL_RESOURCE_NAME_SELECTOR);
        assertThat(flyoutResourceName).isNotNull();
        assertThat(flyoutResourceName.getText()).isNotNull();
        assertThat(resourceName).isEqualTo(flyoutResourceName.getText());
    }

    private static String verifyResourceNameForRow(String tableRow, RemoteWebDriver driver) {
        WebElement tableRowResourceName = querySelect(driver, TABLE_ROW_SELECTOR + tableRow + ") td:nth-child(1) .custom-table__cell_value");
        assertThat(tableRowResourceName).isNotNull();
        assertThat(tableRowResourceName.getText()).isNotNull();
        return tableRowResourceName.getText();
    }
}
