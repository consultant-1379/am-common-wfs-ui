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
import java.util.ArrayList;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBackupsTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadResources;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;
import static org.assertj.core.api.Assertions.assertThat;

public class BackupsListTest extends UITest {
    private static final Logger LOGGER = LoggerFactory.getLogger(BackupsListTest.class);
    private static final String GO_TO_DETAILS = "Go-to-details-page";
    private static final String BACKUPS_TABLE_ROWS_SELECTOR = "#resource-details-backups-table tbody tr";

    @Test(dataProvider = "driver")
    public void backupsListFlow(String version, RemoteWebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
            loadResources(driver);
            driver.manage().window().maximize();

            LOGGER.info("Clicking 'Go to details page' context menu option for resource id wf1ce-rd45-477c-vnf0-backup00");
            clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS);

            LOGGER.info("Clicking on the 'Backups' tab");
            clickBackupsTab(driver);

            LOGGER.info("Checking table headers load accurately");
            verifyTableHeadersForBackups(driver);

            LOGGER.info("Checking there are three entries in the table");
            verifyEntryCountInBackupsTable(driver, 3);
        } catch (Exception e) {
            takeScreenshot(driver, "backupsListTest_" + version);
            throw e;
        }
    }

    private static void verifyTableHeadersForBackups(RemoteWebDriver driver) {
        ArrayList<WebElement> tableHeaders = querySelectAll(driver, "th");
        ArrayList<String> tableHeaderValues = new ArrayList<>();
        for (WebElement webElement : tableHeaders) {
            tableHeaderValues.add(webElement.getText());
        }
        assertThat(tableHeaderValues).contains(
                "Name", "Creation Time", "Status", "Backup scope"
        );
    }

    private static void verifyEntryCountInBackupsTable(RemoteWebDriver driver, int expectedEntryCount) {
        assertThat(querySelectAll(driver, BACKUPS_TABLE_ROWS_SELECTOR)).isNotNull();
        assertThat(querySelectAll(driver, BACKUPS_TABLE_ROWS_SELECTOR).size()).isEqualTo(expectedEntryCount);
    }
}
