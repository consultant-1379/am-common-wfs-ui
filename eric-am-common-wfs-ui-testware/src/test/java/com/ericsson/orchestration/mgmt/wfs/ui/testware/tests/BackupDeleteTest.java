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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.COMPLETE_BACKUP_ID;

import static org.assertj.core.api.Assertions.assertThat;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkOperationResultMessageIsReceived;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.openDeleteBackupForm;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBackupsTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadResources;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.BACKUP_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;

import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.time.Duration;

public class BackupDeleteTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(BackupDeleteTest.class);
    private static final String GO_TO_DETAILS = "Go-to-details-page";
    private static final String CANCEL_BUTTON_SELECTOR = "eui-base-v0-dialog[label=\"Delete Backup\"] eui-base-v0-button";
    private static final String DELETE_BUTTON_SELECTOR = "eui-base-v0-dialog[label=\"Delete Backup\"] eui-base-v0-button[warning=\"\"]";
    private static final String DELETE_BACKUP_TEXT_TITLE_SELECTOR = "eui-base-v0-dialog[label=\"Delete Backup\"] .dialog__title";
    private static final String DELETE_BACKUP_NAME_TEXT_BODY_SELECTOR = "eui-base-v0-dialog[label=\"Delete Backup\"] div[slot=content] div";
    private static final String DELETE_BACKUP_NAME_TEXT_CONFIRM_SELECTOR = "p.sub-content";
    private static final String DELETE_BACKUP_TEXT_TITLE = "Delete Backup";
    private static final String DELETE_BACKUP_NAME_TEXT_BODY = String.format("The backup [%s] will be permanently deleted.", COMPLETE_BACKUP_ID);
    private static final String DELETE_BACKUP_NAME_TEXT_CONFIRM = "Do you want to continue?";
    private static final String DELETE_BACKUP_STARTED_MESSAGE = "Delete backup started\n" + "Request to BRO was successful";

    @Test(dataProvider = "driver")
    public void backupsDeleteFlow(String version, RemoteWebDriver driver) {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        loadResources(driver);
        driver.manage().window().maximize();

        LOGGER.info("Clicking 'Go to details page' context menu option for resource id wf1ce-rd45-477c-vnf0-backup00");
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS);

        LOGGER.info("Clicking on the 'Backups' tab");
        clickBackupsTab(driver);

        LOGGER.info("Clicking 'delete' context menu option for backup id " + COMPLETE_BACKUP_ID);
        openDeleteBackupForm(driver, String.format(BACKUP_MENU_SELECTOR, COMPLETE_BACKUP_ID));

        LOGGER.info("Checking that Backup Delete dialog screen is displayed correctly");

        assertThat(querySelect(driver, DELETE_BACKUP_TEXT_TITLE_SELECTOR).getText()).isEqualTo(DELETE_BACKUP_TEXT_TITLE);
        assertThat(querySelect(driver, DELETE_BACKUP_NAME_TEXT_BODY_SELECTOR).getText())
                .isEqualTo(DELETE_BACKUP_NAME_TEXT_BODY);
        assertThat(querySelect(driver, DELETE_BACKUP_NAME_TEXT_CONFIRM_SELECTOR).getText()).isEqualTo(DELETE_BACKUP_NAME_TEXT_CONFIRM);

        LOGGER.info("Clicking 'Cancel' on Backup Delete dialog screen");
        clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);

        LOGGER.info("Clicking 'delete' context menu option for backup id " + COMPLETE_BACKUP_ID);
        openDeleteBackupForm(driver, String.format(BACKUP_MENU_SELECTOR, COMPLETE_BACKUP_ID));

        LOGGER.info("Clicking 'Delete' on Backup Delete dialog screen");
        clickOnTheButton(driver, DELETE_BUTTON_SELECTOR);

        LOGGER.info("Checking that Backup Delete dialog screen is closed and Backup Delete Started notification is displayed");
        checkOperationResultMessageIsReceived(driver, DELETE_BACKUP_STARTED_MESSAGE);
    }
}
