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
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOf;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.manualSleep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.UITest.getHost;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.qameta.allure.Step;

import java.time.Duration;

class LoginSteps {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginSteps.class);
    private static final String KC_HEADER_WRAPPER = "kc-header-wrapper";



    private LoginSteps() {
    }

    @Step("Login to UI")
    static void login(RemoteWebDriver driver, String username, String password, String testName) {
        try {
            manualSleep(2000); //sleeping as page it taking some time to redirect during CI execution
            LOGGER.info("Trying to login with user {} as part of test: {}", username, testName);
            driver.get(getHost());
            manualSleep(2000); //sleeping as page it taking some time to redirect during CI execution

            new WebDriverWait(driver, Duration.ofSeconds(2))
                    .until(ExpectedConditions.elementToBeClickable(By.id("username")));
            String setElementValueScript = "document.getElementById('%s').setAttribute('value', '%s')";

            driver.executeScript(String.format(setElementValueScript, "username", username));
            driver.executeScript(String.format(setElementValueScript, "password", password));

            WebElement loginButton = driver.findElement(By.id("kc-login-input"));
            assertThat(loginButton).isNotNull();

            driver.executeScript("arguments[0].removeAttribute('disabled')", loginButton);
            driver.executeScript("arguments[0].click()", loginButton);

            manualSleep(2000); //sleeping as driver is taking a longer time to redirect during CI execution
        } catch (Exception e) {
            printLoginErrorWithInnerHTML(driver, e);
            throw e;
        }
    }

    private static void printLoginErrorWithInnerHTML(final RemoteWebDriver driver, final Exception e) {
        printActionErrorWithInnerHTML(driver, "login", e);
    }

    public static void printActionErrorWithInnerHTML(final RemoteWebDriver driver, final String actionName, final Exception e) {
        WebElement body = driver.findElement(By.tagName("body"));
        if (body != null) {
            LOGGER.error("Failed to {}: inner html content : {}", actionName, body.getAttribute("innerHTML"));
        } else {
            LOGGER.error("Failed to {} and get by attribute 'body' was null", actionName, e);
        }
        LOGGER.error("Failed to {} at URL: {}.", actionName, driver.getCurrentUrl(), e);
    }

    @Step("Logout with retry")
    static void logoutWithRetry(RemoteWebDriver driver, boolean retry) {
        try {
            logout(driver);
        } catch (Exception e) {
            LOGGER.warn("Catching exception and continuing", e);
        }
        try {
            LOGGER.info("Looking for id username");
            driver.findElement(By.id("username"));
        } catch (NoSuchElementException e) {
            if (retry) {
                LOGGER.info("Logout failed retrying...");
                manualSleep(2000); //sleeping in case page is currently reloading from previous slow logout
                logoutWithRetry(driver, false);
                LOGGER.info("Successfully logged out");
            } else {
                LOGGER.info("Failed to logout and no retries left");
                throw e;
            }
        }
    }

    @Step("Logout")
    static void logout(RemoteWebDriver driver) {
        LOGGER.info("Logout method");
        WebElement userLogoutPanel = querySelect(driver, "div[data-payload*=user-logout-panel]");
        LOGGER.info("Clicking logout panel button");
        userLogoutPanel.click();
        WebElement signoutButton = querySelect(driver, "e-user-logout-panel eui-base-v0-button");
        manualSleep(1000); //sleeping to allow flyout to complete animation
        LOGGER.info("Clicking sign out button");
        signoutButton.click();
        new WebDriverWait(driver, Duration.ofSeconds(5)).until(invisibilityOf(signoutButton));
        checkOnKeycloakPage(driver);
    }

    static void checkOnKeycloakPage(WebDriver driver) {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(6L));
            wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.id(KC_HEADER_WRAPPER))));
    }
}
