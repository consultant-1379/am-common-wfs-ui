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
import static org.testng.AssertJUnit.assertEquals;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsDisabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonIsEnabled;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkButtonName;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clearTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnTheButton;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillTextField;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.uploadTempFileWithExtension;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyElementAttributeEqualTo;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES_URL_PART;

import java.io.File;
import java.io.IOException;
import java.time.Duration;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class OnboardPackageTest extends UITest {
    private static final Logger LOGGER = LoggerFactory.getLogger(OnboardPackageTest.class);
    private static final String ONBOARD_PACKAGE_DIALOG_BUTTON_SELECTOR = "#packages_onboarding_button";
    private static final String ONBOARD_BUTTON_SELECTOR = "#fileUpload-uploadButton";
    private static final String ONBOARD_TITLE_SELECTOR = ".dialog__title";
    private static final String FILE_UPLOADER_BUTTON_SELECTOR = "#fileUpload-importButton";
    private static final String FILE_UPLOADER_BUTTON_INPUT_SELECTOR = "#fileUpload-importButton input[type=file]";
    private static final String FILE_UPLOADER_BUTTON_TEXT = "Select file";
    private static final String FILE_UPLOADER_TEXTFIELD_SELECTOR = "#fileUpload-textField";
    private static final String FILE_UPLOADER_TEXTFIELD_PLACEHOLDER_TEXT = "Please select file...";
    private static final String ONBOARD_TIMEOUT_LABEL_SELECTOR = ".timeOut-textField label";
    private static final String ONBOARD_TIMEOUT_LABEL_TEXT = "Timeout (minute)";
    private static final String ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR = "eui-base-v0-text-field#timeOut";
    private static final String ONBOARD_TIMEOUT_TEXTFIELD_PLACEHOLDER_TEXT = "Defaulted to 120 min";
    private static final String DEFAULT_ONBOARD_TIMEOUT_VALUE = "120";
    private static final String SKIP_IMAGE_CHECKBOX_SELECTOR = "#skipImage-checkBox";
    private static final String SKIP_IMAGE_CHECKBOX_TEXT = "Skip Image Upload";
    private static final String NOTIFICATION_SELECTOR = "eui-base-v0-notification";
    private static final String INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR = "#errorMessage";
    private static final String INVALID_TIMEOUT_ERROR_MESSAGE = "Invalid Timeout";
    private static final String INVALID_FILE_ERROR_MESSAGE = "File type not supported\nOnly .csar";
    private static final String DISABLED = "disabled";
    private static final String CHECKED = "checked";
    private static final String TRUE = "true";
    public static final String PLACEHOLDER = "Placeholder";
    public static final String VALUE = "Value";
    private static final String PACKAGES_PAGE_PATH = "/#packages";
    private static final String ONBOARD_TITLE_TEXT = "Uploading file";

    @Test(dataProvider = "driver")
    public void testOnboardingFileUploadDialog(String version, RemoteWebDriver driver) throws IOException {
        try {
            goToPackagesPage(driver);
            assertThat(driver.getCurrentUrl()).contains(PACKAGES_URL_PART);
            querySelect(driver, ONBOARD_PACKAGE_DIALOG_BUTTON_SELECTOR).click();

            LOGGER.info("Verify onboarding dialog is shown as expected.");
            verifyOnboardingDialog(driver);

            LOGGER.info("Verify onboard timeout field is working as expected.");
            verifyOnboardTimeoutWithInvalidInput(driver, "-5");
            verifyOnboardTimeoutWithInvalidInput(driver, "a");
            verifyOnboardTimeoutWithValidInput(driver, "120");
            checkButtonIsDisabled(driver, ONBOARD_BUTTON_SELECTOR);

            LOGGER.info("Verify skip image upload button is working as expected.");
            verifyElementAttributeEqualTo(driver, SKIP_IMAGE_CHECKBOX_SELECTOR, CHECKED, null);
            clickOnTheButton(driver, SKIP_IMAGE_CHECKBOX_SELECTOR);
            verifyElementAttributeEqualTo(driver, SKIP_IMAGE_CHECKBOX_SELECTOR, CHECKED, TRUE);
            checkButtonIsDisabled(driver, ONBOARD_BUTTON_SELECTOR);
            clickOnTheButton(driver, SKIP_IMAGE_CHECKBOX_SELECTOR);
            verifyElementAttributeEqualTo(driver, SKIP_IMAGE_CHECKBOX_SELECTOR, CHECKED, null);
            checkButtonIsDisabled(driver, ONBOARD_BUTTON_SELECTOR);

            LOGGER.info("Verify file uploader accepts .zip file extension.");
            File zipTempFile = uploadTempFileWithExtension(driver, FILE_UPLOADER_BUTTON_INPUT_SELECTOR, ".zip");
            verifyElementAttributeEqualTo(driver, FILE_UPLOADER_TEXTFIELD_SELECTOR, PLACEHOLDER, zipTempFile.getName());
            checkButtonIsEnabled(driver, ONBOARD_BUTTON_SELECTOR);

            LOGGER.info("Verify after provide valid input, upload button is clickable.");
            File tempFile = uploadTempFileWithExtension(driver, FILE_UPLOADER_BUTTON_INPUT_SELECTOR, ".csar");
            verifyElementAttributeEqualTo(driver, FILE_UPLOADER_TEXTFIELD_SELECTOR, PLACEHOLDER, tempFile.getName());
            fillTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, "a");
            checkButtonIsDisabled(driver, ONBOARD_BUTTON_SELECTOR);
            clearTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR);
            fillTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, "120");
            checkButtonIsEnabled(driver, ONBOARD_BUTTON_SELECTOR);
        } catch (Exception e) {
            takeScreenshot(driver, "onboard_package_test_" + version);
            throw e;
        }
    }

    private static void goToPackagesPage(RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        WebElement openAppNavigationFlyOutButton = querySelect(driver, "#AppBar-menu-toggle");
        wait.until(ExpectedConditions.elementToBeClickable(openAppNavigationFlyOutButton));
        driver.get(getHost() + PACKAGES_PAGE_PATH);
        driver.manage().window().maximize();
    }

    private static void verifyOnboardingDialog(RemoteWebDriver driver) {
        LOGGER.info("Verify that onboard dialog title header is displayed correctly");
        assertThat(querySelect(driver, ONBOARD_TITLE_SELECTOR).getText()).isEqualTo(ONBOARD_TITLE_TEXT);

        LOGGER.info("Verify Upload section is displayed according to mock-ups");
        checkButtonName(driver, FILE_UPLOADER_BUTTON_SELECTOR, FILE_UPLOADER_BUTTON_TEXT);
        checkButtonIsEnabled(driver, FILE_UPLOADER_BUTTON_SELECTOR);
        verifyElementAttributeEqualTo(driver, FILE_UPLOADER_TEXTFIELD_SELECTOR, PLACEHOLDER, FILE_UPLOADER_TEXTFIELD_PLACEHOLDER_TEXT);
        verifyElementAttributeEqualTo(driver, FILE_UPLOADER_TEXTFIELD_SELECTOR, DISABLED, TRUE);

        LOGGER.info("Verify that Onboard time section is displayed correctly");
        WebElement onboardTimeoutLabel = querySelect(driver, ONBOARD_TIMEOUT_LABEL_SELECTOR);
        assertThat(onboardTimeoutLabel.getText()).isEqualTo(ONBOARD_TIMEOUT_LABEL_TEXT);
        verifyElementAttributeEqualTo(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, PLACEHOLDER, ONBOARD_TIMEOUT_TEXTFIELD_PLACEHOLDER_TEXT);
        verifyElementAttributeEqualTo(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, VALUE, DEFAULT_ONBOARD_TIMEOUT_VALUE);

        LOGGER.info("Verify that skip image upload section is displayed correctly");
        WebElement skipImageCheckbox = querySelect(driver, SKIP_IMAGE_CHECKBOX_SELECTOR);
        assertThat(skipImageCheckbox.getText()).isEqualTo(SKIP_IMAGE_CHECKBOX_TEXT);
        assertThat(skipImageCheckbox.getAttribute(CHECKED)).isNull();
    }

    private static void verifyOnboardTimeoutWithInvalidInput(RemoteWebDriver driver, String value) {
        fillTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, value);
        waitForElementWithText(driver, INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR, INVALID_TIMEOUT_ERROR_MESSAGE);
        checkButtonIsDisabled(driver, ONBOARD_BUTTON_SELECTOR);
        clearTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR);
    }

    private static void verifyOnboardTimeoutWithValidInput(RemoteWebDriver driver, String value) {
        fillTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR, value);
        WebElement invalidAppTimeoutErrorMessage = querySelect(driver, INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR);
        assertEquals(invalidAppTimeoutErrorMessage.getCssValue("display"), "none");
        clearTextField(driver, ONBOARD_TIMEOUT_TEXTFIELD_SELECTOR);
    }
}
