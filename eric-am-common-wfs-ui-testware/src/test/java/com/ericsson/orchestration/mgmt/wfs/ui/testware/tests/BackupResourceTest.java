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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.cancelBackupResourceForm;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkBackupResourceFormIsClosed;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkErrorMessageForBackupNameField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.checkOperationResultMessageIsReceived;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.BackupSteps.openBackupResourceForm;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.RADIO_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsEnabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkSelectedDropdownValue;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.selectFromDropdown;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_4_ID;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class BackupResourceTest extends UITest{

    private static final Logger LOGGER = LoggerFactory.getLogger(BackupResourceTest.class);
    private static final String BACKUP_OPTION_RES4_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_4_ID;
    private static final String BACKUP_BUTTON_SELECTOR = "#backup";
    private static final String CANCEL_BUTTON_SELECTOR = ".cancel";
    private static final String SCOPE_DROPDOWN_SELECTOR = "#backup-scope";
    private static final String BACKUP_NAME_FIELD_SELECTOR = "#backup-name";
    private static final String BACKUP_DIALOG_TEXT_SELECTOR = ".dialog__title";
    private static final String SCOPE_DROPDOWN_LIST_SELECTOR = "#backup-scope eui-base-v0-radio-button";
    private static final String DROPDOWN_FIELD_SELECTOR = "#backup-scope eui-base-v0-dropdown";
    private static final String BACKUP_NAME_ERROR_MESSAGE_SELECTOR = ".errorMessage span";

    private static final String BACKUP_TEXT = "Backup resource";
    private static final String BACKUP_STARTED_MESSAGE = "Backup started\n" + "downgrade-test-valid is being backed up";
    private static final String VALID_BACKUP_NAME = "backup_test_1";
    private static final String INVALID_BACKUP_NAME = "\\s`!@#$%^&*()£+=[\\]{};:\\|,.<>\\/?~\"'";
    private static final String TOO_LONG_BACKUP_NAME = "LoremipsumdolorsitametconsecteturadipiscingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisknostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatDuisauteiruredolorinreprehenderitinvoluptatevelitessecillumdolor";
    private static final String MAX_LENGTH_BACKUP_NAME = "LoremipsumdolorsitametconsecteturadipiscingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisknostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatDuisauteiruredolorinreprehenderitinvoluptatevelitessecillu";
    private static final String DEFAULT_SCOPE_VALUE = "DEFAULT";
    private static final String EVNFM_SCOPE_VALUE = "EVNFM";
    private static final String INVALID_BACKUP_NAME_ERROR_MESSAGE = "Invalid character(s) in backup name";
    private static final String TOO_LONG_BACKUP_NAME_ERROR_MESSAGE = "Maximum backup name length is 250";
    private static final String EMPTY_BACKUP_NAME_ERROR_MESSAGE = "Backup name cannot be empty";

    @Test(dataProvider = "driver")
    public void testBackupResource(String version, RemoteWebDriver driver) {
        loadApplication(RESOURCES, driver);
        driver.manage().window().maximize();
        assertThat(driver.getCurrentUrl()).contains(RESOURCES_URL_PART);

        LOGGER.info("Checking successful backup creation on the resource");
        openBackupResourceForm(driver, BACKUP_OPTION_RES4_MENU_SELECTOR);

        LOGGER.info("Checking that Backup resource dialog screen is displayed correctly");
        checkButtonIsEnabled(driver, CANCEL_BUTTON_SELECTOR);
        checkButtonIsEnabled(driver, BACKUP_BUTTON_SELECTOR);
        WebElement scopeDropdown = querySelect(driver, SCOPE_DROPDOWN_SELECTOR);
        assertThat(scopeDropdown).isNotNull();
        assertThat(querySelect(driver, BACKUP_DIALOG_TEXT_SELECTOR).getText()).isEqualTo(BACKUP_TEXT);

        LOGGER.info("Checking that Scope can be selected from dropdown list");
        checkSelectedDropdownValue(driver, DROPDOWN_FIELD_SELECTOR, EVNFM_SCOPE_VALUE);
        selectFromDropdown(driver, DEFAULT_SCOPE_VALUE, SCOPE_DROPDOWN_LIST_SELECTOR, RADIO_BUTTON_SELECTOR, scopeDropdown);
        checkSelectedDropdownValue(driver, DROPDOWN_FIELD_SELECTOR, DEFAULT_SCOPE_VALUE);

        LOGGER.info("Checking that Backup name is mandatory field");
        clearTextField(driver, BACKUP_NAME_FIELD_SELECTOR);
        clickOnTheButton(driver, BACKUP_BUTTON_SELECTOR);
        checkErrorMessageForBackupNameField(driver, BACKUP_NAME_ERROR_MESSAGE_SELECTOR, EMPTY_BACKUP_NAME_ERROR_MESSAGE);


        LOGGER.info("Checking that spec symbol can not be in Backup name - error appears during creation");
        clearTextField(driver, BACKUP_NAME_FIELD_SELECTOR);
        fillTextField(driver, BACKUP_NAME_FIELD_SELECTOR, INVALID_BACKUP_NAME);
        clickOnTheButton(driver, BACKUP_BUTTON_SELECTOR);
        checkErrorMessageForBackupNameField(driver, BACKUP_NAME_ERROR_MESSAGE_SELECTOR, INVALID_BACKUP_NAME_ERROR_MESSAGE);

        LOGGER.info("Checking that Backup name field is limited to 250 symbols");
        clearTextField(driver, BACKUP_NAME_FIELD_SELECTOR);
        fillTextField(driver, BACKUP_NAME_FIELD_SELECTOR, TOO_LONG_BACKUP_NAME);
        clickOnTheButton(driver, BACKUP_BUTTON_SELECTOR);
        checkErrorMessageForBackupNameField(driver, BACKUP_NAME_ERROR_MESSAGE_SELECTOR, TOO_LONG_BACKUP_NAME_ERROR_MESSAGE);
        clearTextField(driver, BACKUP_NAME_FIELD_SELECTOR);
        fillTextField(driver, BACKUP_NAME_FIELD_SELECTOR, MAX_LENGTH_BACKUP_NAME);
        clickOnTheButton(driver, BACKUP_BUTTON_SELECTOR);
        checkOperationResultMessageIsReceived(driver, BACKUP_STARTED_MESSAGE);
        checkBackupResourceFormIsClosed(driver);

        LOGGER.info("Checking that Backup resource dialog screen is closed and Backup Started notification is displayed");
        openBackupResourceForm(driver, BACKUP_OPTION_RES4_MENU_SELECTOR);
        clearTextField(driver, BACKUP_NAME_FIELD_SELECTOR);
        fillTextField(driver, BACKUP_NAME_FIELD_SELECTOR, VALID_BACKUP_NAME);
        clickOnTheButton(driver, BACKUP_BUTTON_SELECTOR);
        checkOperationResultMessageIsReceived(driver, BACKUP_STARTED_MESSAGE);
        checkBackupResourceFormIsClosed(driver);

        LOGGER.info("Checking that Backup resource dialog screen without entered backup name can be canceled - dialog is closed");
        openBackupResourceForm(driver, BACKUP_OPTION_RES4_MENU_SELECTOR);
        cancelBackupResourceForm(driver);

        LOGGER.info("Checking that Backup resource dialog screen with entered backup name can be canceled - dialog is closed");
        openBackupResourceForm(driver, BACKUP_OPTION_RES4_MENU_SELECTOR);
        fillTextField(driver, BACKUP_NAME_FIELD_SELECTOR, VALID_BACKUP_NAME);
        cancelBackupResourceForm(driver);
    }
}
