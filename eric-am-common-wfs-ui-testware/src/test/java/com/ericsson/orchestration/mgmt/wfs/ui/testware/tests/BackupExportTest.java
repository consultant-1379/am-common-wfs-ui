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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkExportBackupFormIsClosed;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkOperationResultMessageIsReceived;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.selectExportBackupProtocolDropdownOption;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkSelectedDropdownValue;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsEnabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBackupsTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadResources;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkErrorMessageForExportBackupField;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.COMPLETE_BACKUP_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CORRUPTED_BACKUP_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCOMPLETE_BACKUP_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_DETAILS_URL_PART;

import static org.assertj.core.api.Assertions.assertThat;

public class BackupExportTest extends UITest {
    private static final Logger LOGGER = LoggerFactory.getLogger(BackupExportTest.class);
    private static final String GO_TO_DETAILS = "Go-to-details-page";
    private static final String EXPORT_CONTEXT_MENU_OPTION = "Export-to-external-location";
    private static final String EXPORT_OPTION_INCOMPLETE_BACKUP_SELECTOR = ".custom-table__cell #" + EXPORT_CONTEXT_MENU_OPTION + "__" + INCOMPLETE_BACKUP_ID;
    private static final String EXPORT_OPTION_CORRUPTED_BACKUP_SELECTOR = ".custom-table__cell #" + EXPORT_CONTEXT_MENU_OPTION + "__" + CORRUPTED_BACKUP_ID;
    private static final String COMPLETE_BACKUP_CONTEXT_MENU_SELECTOR = String.format("e-context-menu[id=\"%s\"]", COMPLETE_BACKUP_ID+"__EVNFM");
    private static final String CANCEL_BUTTON_SELECTOR = ".cancel";
    private static final String EXPORT_BUTTON_SELECTOR = "#exportBackup";
    private static final String REMOTE_URL_FIELD_SELECTOR = "#exportBackup-remoteURL";
    private static final String USERNAME_FIELD_SELECTOR = "#exportBackup-username";
    private static final String PASSWORD_FIELD_SELECTOR = "#exportBackup-password";
    private static final String REMOTE_URL_ERROR_MESSAGE_SELECTOR = "#exportBackupErrorMessage-remoteURL span";
    private static final String USERNAME_ERROR_MESSAGE_SELECTOR = "#exportBackupErrorMessage-username span";
    private static final String PASSWORD_ERROR_MESSAGE_SELECTOR = "#exportBackupErrorMessage-password span";
    private static final String PROTOCOL_DROPDOWN_LIST_SELECTOR = "#backupExport-protocol div";
    private static final String PROTOCOL_DROPDOWN_SELECTOR = "#backupExport-protocol";
    private static final String HTTP_PROTOCOL_VALUE = "http";
    private static final String SFTP_PROTOCOL_VALUE = "sftp";

    private static final String VALID_PROTOCOL = "localhost";
    private static final String VALID_USERNAME = "username";
    private static final String VALID_PASSWORD = "password";
    private static final String FIELD_REMOTE_URL = "Remote URL";
    private static final String FIELD_USERNAME = "Username";
    private static final String FIELD_PASSWORD = "Password";
    private static final String EMPTY_REMOTE_URL_ERROR_MESSAGE = "Remote url cannot be empty";
    private static final String EMPTY_USERNAME_ERROR_MESSAGE = "Username cannot be empty";
    private static final String EMPTY_PASSWORD_ERROR_MESSAGE = "Password cannot be empty";
    private static final String EXPORT_STARTED_NOTIFICATION = "Export backup started\n" + "Request to BRO was successful";

    @Test(dataProvider = "driver")
    public void testExportBackup(String version, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        loadResources(driver);
        driver.manage().window().maximize();

        LOGGER.info("Clicking 'Go to details page' context menu option for resource id wf1ce-rd45-477c-vnf0-backup00");
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS);

        LOGGER.info("Confirming current page is resource details page");
        assertThat(driver.getCurrentUrl()).contains(RESOURCE_DETAILS_URL_PART);

        LOGGER.info("Clicking on the 'Backups' tab");
        clickBackupsTab(driver);

        LOGGER.info("Checking Export context menu option not present for INCOMPLETE and CORRUPTED backups");
        WebElement optionForIncompleteBackup = querySelect(driver, EXPORT_OPTION_INCOMPLETE_BACKUP_SELECTOR);
        WebElement optionForCorruptedBackup = querySelect(driver, EXPORT_OPTION_CORRUPTED_BACKUP_SELECTOR);
        assertThat(optionForIncompleteBackup).isNull();
        assertThat(optionForCorruptedBackup).isNull();

        LOGGER.info("Opening Export backup form for backup with id " + COMPLETE_BACKUP_ID);
        clickContextMenuItem(driver, wait, COMPLETE_BACKUP_CONTEXT_MENU_SELECTOR, EXPORT_CONTEXT_MENU_OPTION);

        LOGGER.info("Checking Export backup form is displayed correctly");
        checkButtonIsEnabled(driver, CANCEL_BUTTON_SELECTOR);
        checkButtonIsEnabled(driver, EXPORT_BUTTON_SELECTOR);
        WebElement protocolDropdown = querySelect(driver, PROTOCOL_DROPDOWN_SELECTOR);
        assertThat(protocolDropdown).isNotNull();

        LOGGER.info("Checking that Protocol can be selected from dropdown list");
        checkSelectedDropdownValue(driver, PROTOCOL_DROPDOWN_SELECTOR, HTTP_PROTOCOL_VALUE);
        selectExportBackupProtocolDropdownOption(driver, PROTOCOL_DROPDOWN_LIST_SELECTOR, SFTP_PROTOCOL_VALUE, protocolDropdown);
        checkSelectedDropdownValue(driver, PROTOCOL_DROPDOWN_SELECTOR, SFTP_PROTOCOL_VALUE);

        LOGGER.info("Checking that Remote Url is mandatory field");
        clearTextField(driver, REMOTE_URL_FIELD_SELECTOR);
        clickOnTheButton(driver, EXPORT_BUTTON_SELECTOR);
        checkErrorMessageForExportBackupField(driver, REMOTE_URL_ERROR_MESSAGE_SELECTOR, EMPTY_REMOTE_URL_ERROR_MESSAGE, FIELD_REMOTE_URL);

        LOGGER.info("Checking that Username is mandatory field");
        clearTextField(driver, USERNAME_FIELD_SELECTOR);
        clickOnTheButton(driver, EXPORT_BUTTON_SELECTOR);
        checkErrorMessageForExportBackupField(driver, USERNAME_ERROR_MESSAGE_SELECTOR, EMPTY_USERNAME_ERROR_MESSAGE, FIELD_USERNAME);

        LOGGER.info("Checking that Password is mandatory field");
        clearTextField(driver, PASSWORD_FIELD_SELECTOR);
        clickOnTheButton(driver, EXPORT_BUTTON_SELECTOR);
        checkErrorMessageForExportBackupField(driver, PASSWORD_ERROR_MESSAGE_SELECTOR, EMPTY_PASSWORD_ERROR_MESSAGE, FIELD_PASSWORD);

        LOGGER.info("Filling Export backup form with correct demo details");
        clearTextField(driver, REMOTE_URL_FIELD_SELECTOR);
        clearTextField(driver, USERNAME_FIELD_SELECTOR);
        clearTextField(driver, PASSWORD_FIELD_SELECTOR);
        fillTextField(driver, REMOTE_URL_FIELD_SELECTOR, VALID_PROTOCOL);
        fillTextField(driver, USERNAME_FIELD_SELECTOR, VALID_USERNAME);
        fillTextField(driver, PASSWORD_FIELD_SELECTOR, VALID_PASSWORD);

        LOGGER.info("Checking that Export backup dialog screen is closed and notification is displayed");
        clickOnTheButton(driver, EXPORT_BUTTON_SELECTOR);
        checkOperationResultMessageIsReceived(driver, EXPORT_STARTED_NOTIFICATION);
        checkExportBackupFormIsClosed(driver);
    }

}
