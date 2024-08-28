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
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

public class BackupSteps {

    private static final Logger LOGGER = LoggerFactory.getLogger(BackupSteps.class);
    private static final String BACKUP_CLUSTER_MENU_ITEM = "Backup";
    private static final String BACKUP_RESOURCE_DIALOG_SELECTOR = "eui-base-v0-dialog[label=\"Backup resource\"]";
    private static final String EXPORT_BACKUP_DIALOG_SELECTOR = "eui-base-v0-dialog[label=\"Export to external location\"]";
    private static final String OPERATION_RESULT_MESSAGE_SELECTOR = "eui-base-v0-notification";
    private static final String CANCEL_BUTTON_SELECTOR = ".cancel";
    private static final String DELETE_BACKUP_DIALOG_SELECTOR = "eui-base-v0-dialog[label=\"Delete Backup\"]";
    private static final String DELETE_BACKUP_MENU_ITEM = "Delete";

    private BackupSteps() {
        // this is a private constructor
    }

    public static void openBackupResourceForm(RemoteWebDriver driver, String backupMenuSelector) {
        LOGGER.info("Open Backup resource form");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        clickContextMenuItem(driver, wait, backupMenuSelector, BACKUP_CLUSTER_MENU_ITEM);
        wait.until(item -> querySelect(driver, BACKUP_RESOURCE_DIALOG_SELECTOR).isDisplayed());
    }

    public static void cancelBackupResourceForm(RemoteWebDriver driver){
        LOGGER.info("Cancel Backup resource form");
        clickOnTheButton(driver, CANCEL_BUTTON_SELECTOR);
        checkBackupResourceFormIsClosed(driver);
    }

    public static void checkBackupResourceFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Backup resource form is closed");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(BACKUP_RESOURCE_DIALOG_SELECTOR)));
        assertThat(querySelect(driver, BACKUP_RESOURCE_DIALOG_SELECTOR)).isNull();
    }

    public static void checkOperationResultMessageIsReceived(RemoteWebDriver driver, String message) {
        LOGGER.info("Verify that operation result message " + message + " was received");
        waitForElementWithText(driver, OPERATION_RESULT_MESSAGE_SELECTOR, message);
    }

    public static void checkErrorMessageForBackupNameField(RemoteWebDriver driver, String errorMessageSelector, String errorMessage){
        LOGGER.info("Verify that error message " + errorMessage + " for Backup name field was received");
        WebElement message = querySelect(driver, errorMessageSelector);
        assertThat(message.getText().equals(errorMessage)).isTrue();
    }

    public static void checkNoErrorMessageForBackupNameField(RemoteWebDriver driver, String errorMessageSelector){
        LOGGER.info("Verify that no error message appears for Backup name field");
        assertThat(querySelect(driver, errorMessageSelector)).isNull();
    }

    public static void checkErrorMessageForExportBackupField(RemoteWebDriver driver, String errorMessageSelector, String errorMessage, String field){
        LOGGER.info("Verify that error message " + errorMessage + " for " + field +" was received");
        WebElement message = querySelect(driver, errorMessageSelector);
        assertThat(message.getText().equals(errorMessage)).isTrue();
    }

    public static void checkExportBackupFormIsClosed(RemoteWebDriver driver) {
        LOGGER.info("Verify that Backup resource form is closed");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(EXPORT_BACKUP_DIALOG_SELECTOR)));
        assertThat(querySelect(driver, EXPORT_BACKUP_DIALOG_SELECTOR)).isNull();
    }

    public static void openDeleteBackupForm(RemoteWebDriver driver, String backupMenuSelector) {
        LOGGER.info("Open Delete Backup form");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        clickContextMenuItem(driver, wait, backupMenuSelector, DELETE_BACKUP_MENU_ITEM);
        wait.until(item -> querySelect(driver, DELETE_BACKUP_DIALOG_SELECTOR).isDisplayed());
    }

    public static void selectExportBackupProtocolDropdownOption(RemoteWebDriver driver, String dropdownOptionSelector, String optionValue, WebElement dropdownList) {
        LOGGER.info("Clicking dropdown option {}", optionValue);
        dropdownList.click();
        waitForElementWithText(driver, dropdownOptionSelector, optionValue).click();
    }
}
