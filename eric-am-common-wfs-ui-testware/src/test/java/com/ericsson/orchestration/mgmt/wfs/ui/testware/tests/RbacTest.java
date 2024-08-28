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
import static org.testng.Assert.fail;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBackupsTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickTableRowById;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeFlyout;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.manualSleep;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openFlyout;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ADD_NODE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.BACKUP_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.CLEAN_UP;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DELETE_NODE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DELETE_PACKAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ERICSSON123;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FLYOUT_CONTEXT_MENU_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GO_TO_DETAILS_PAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.HEAL;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MODIFY_VNF_INFO;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NAME_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGE_2_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_1_ID_FAILED;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_4_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ROLLBACK;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SCALE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SYNC;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.TERMINATE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.UPGRADE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.LoginSteps.checkOnKeycloakPage;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.LoginSteps.login;

import java.time.Duration;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class RbacTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(RbacTest.class);
    private static final String RBAC_LOGOUT_URL = getHost().replaceAll("vnfm$", "logout");

    @Test(dataProvider = "sequential-driver")
    public void testVnfmSuperUser(String version, RemoteWebDriver driver) {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        rbacLogoutWithRetry(driver, true);
        login(driver, "superUser", ERICSSON123, "testVnfmSuperUser");

        //resource page elements
        driver.get(getHost());
        manualSleep(2000);
        userCanViewApp(driver, RESOURCES, true, false);
        userCanInstantiateFromResourcesPageButton(driver, true);
        openContextMenu(driver, RESOURCE_1_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, UPGRADE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, TERMINATE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SCALE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SYNC, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, true);
        closeContextMenu(driver);
        userHasOptionFromContextMenu(driver, RESOURCE_4_ID, ROLLBACK, true);
        closeContextMenu(driver);
        openContextMenu(driver, RESOURCE_2_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, HEAL, true);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, MODIFY_VNF_INFO, true);
        contextMenuAndFlyout(driver, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, true);
        closeContextMenu(driver);
        clickTableRowById(driver, RESOURCE_2_ID);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, true);
        // backup page elements
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, GO_TO_DETAILS_PAGE, true);
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS_PAGE);
        clickBackupsTab(driver);
        String backupName = querySelect(driver, NAME_SELECTOR).getText();
        userHasBackupOption(driver, String.format(BACKUP_MENU_SELECTOR, backupName), true);
        closeContextMenu(driver);
        loadApplication(RESOURCES, driver);
        contextMenuAndPackages(driver, wait, true, true, true);
    }

    private void contextMenuAndFlyout(final RemoteWebDriver driver, final boolean userHasAccess) {
        closeContextMenu(driver);
        openContextMenu(driver, RESOURCE_1_ID_FAILED);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID_FAILED, CLEAN_UP, userHasAccess);
        closeContextMenu(driver);

        //resource flyout elements
        openFlyout(driver);
        clickTableRowById(driver, RESOURCE_1_ID);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, UPGRADE, userHasAccess);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SCALE, userHasAccess);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, TERMINATE, userHasAccess);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SYNC, userHasAccess);
    }

    private void contextMenuAndPackages(final RemoteWebDriver driver, final WebDriverWait wait, final boolean contextMenuOptions,
                                        final boolean onboardButtonVisible, final boolean deletePackageOption) {
        closeContextMenu(driver);
        clickTableRowById(driver, RESOURCE_1_ID_FAILED);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID_FAILED, CLEAN_UP, contextMenuOptions);
        closeContextMenu(driver);
        closeFlyout(driver, wait);

        //packages page elements
        loadApplication(PACKAGES, driver);
        userCanViewApp(driver, PACKAGES, true, true);
        userCanOnboardFromPackagesPageButton(driver, onboardButtonVisible);
        openContextMenu(driver, "row-" + PACKAGE_2_ID);
        userHasOptionFromContextMenu(driver, PACKAGE_2_ID, INSTANTIATE, contextMenuOptions);
        userHasOptionFromContextMenu(driver, PACKAGE_2_ID, DELETE_PACKAGE, deletePackageOption);
        closeContextMenu(driver);

        //packages flyout elements
        openFlyout(driver);
        clickTableRowById(driver, "row-" + PACKAGE_2_ID);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, PACKAGE_2_ID, INSTANTIATE, contextMenuOptions);
        userHasOptionFromContextMenu(driver, PACKAGE_2_ID, DELETE_PACKAGE, deletePackageOption);
        closeContextMenu(driver);
        closeFlyout(driver, wait);

        loadApplication(OPERATIONS, driver);
        userCanViewApp(driver, OPERATIONS, true, true);
    }

    @Test(dataProvider = "sequential-driver")
    public void testVnfmUser(String version, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        rbacLogoutWithRetry(driver, true);
        login(driver, "user", ERICSSON123, "testVnfmUser");

        //resource page elements
        driver.get(getHost());
        manualSleep(2000);
        userCanViewApp(driver, RESOURCES, true, false);
        userCanInstantiateFromResourcesPageButton(driver, true);
        openContextMenu(driver, RESOURCE_1_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, UPGRADE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SCALE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SYNC, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, TERMINATE, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, false);
        closeContextMenu(driver);
        userHasOptionFromContextMenu(driver, RESOURCE_4_ID, ROLLBACK, true);
        closeContextMenu(driver);
        openContextMenu(driver, RESOURCE_2_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, false);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, HEAL, true);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, MODIFY_VNF_INFO, true);
        contextMenuAndFlyout(driver, true);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, false);
        closeContextMenu(driver);
        clickTableRowById(driver, RESOURCE_2_ID);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, false);
        // backup page elements
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, GO_TO_DETAILS_PAGE, true);
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS_PAGE);
        clickBackupsTab(driver);
        String backupName = querySelect(driver, NAME_SELECTOR).getText();
        userHasBackupOption(driver, String.format(BACKUP_MENU_SELECTOR, backupName), true);
        closeContextMenu(driver);
        loadApplication(RESOURCES, driver);
        contextMenuAndPackages(driver, wait, true, false, false);
    }

    @Test(dataProvider = "sequential-driver")
    public void testVnfmReadOnlyUser(String version, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        rbacLogoutWithRetry(driver, true);
        login(driver, "readonly", ERICSSON123, "testVnfmReadOnlyUser");

        //resource page elements
        driver.get(getHost());
        manualSleep(2000);
        userCanViewApp(driver, RESOURCES, true, false);
        userCanInstantiateFromResourcesPageButton(driver, false);
        openContextMenu(driver, RESOURCE_1_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, UPGRADE, false);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SCALE, false);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, SYNC, false);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, TERMINATE, false);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, false);
        closeContextMenu(driver);
        userHasOptionFromContextMenu(driver, RESOURCE_4_ID, ROLLBACK, false);
        closeContextMenu(driver);
        openContextMenu(driver, RESOURCE_2_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, false);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, HEAL, false);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, MODIFY_VNF_INFO, false);
        contextMenuAndFlyout(driver, false);
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, DELETE_NODE, false);
        closeContextMenu(driver);
        clickTableRowById(driver, RESOURCE_2_ID);
        openContextMenu(driver, FLYOUT_CONTEXT_MENU_ID);
        userHasOptionFromContextMenu(driver, RESOURCE_2_ID, ADD_NODE, false);
        // backup page elements
        userHasOptionFromContextMenu(driver, RESOURCE_1_ID, GO_TO_DETAILS_PAGE, true);
        clickContextMenuItem(driver, wait, RESOURCE_1_CONTEXT_MENU_SELECTOR, GO_TO_DETAILS_PAGE);
        clickBackupsTab(driver);
        String backupName = querySelect(driver, NAME_SELECTOR).getText();
        userHasBackupOption(driver, String.format(BACKUP_MENU_SELECTOR, backupName), false);
        closeContextMenu(driver);
        loadApplication(RESOURCES, driver);
        contextMenuAndPackages(driver, wait, false, false, false);
    }

    @Test(dataProvider = "sequential-driver")
    public void testVnfmUIUserWithNoPermissions(String version, RemoteWebDriver driver) {
        rbacLogoutWithRetry(driver, true);
        manualSleep(2000);
        login(driver, "uiUser", ERICSSON123, "testVnfmUIUserWithNoPermissions");

        //resource page elements
        driver.get(getHost());
        manualSleep(2000);
        userCanViewApp(driver, RESOURCES, false, false);
        userCanInstantiateFromResourcesPageButton(driver, false);
        userCanSeeContextMenu(driver, RESOURCE_1_ID, false);

        //packages page elements
        loadApplication(PACKAGES, driver);
        userCanViewApp(driver, PACKAGES, false, true);
        userCanOnboardFromPackagesPageButton(driver, false);
        userCanSeeContextMenu(driver, PACKAGE_2_ID, false);

        loadApplication(OPERATIONS, driver);
        userCanViewApp(driver, OPERATIONS, false, true);
    }

    private void userCanViewApp(RemoteWebDriver driver, String applicationName, boolean userHasAccess, boolean retry) {
        try {
            if (userHasAccess) {
                waitForElementWithText(driver, "#main-panel-title", applicationName, 10000,
                                       4000); // increased from default timeout as getting blank page occasionally
            } else {
                waitForElementWithText(driver, "div>p", "Access denied", 10000,
                                       4000); // increased from default timeout as getting blank page occasionally
            }
        } catch (Exception e) {
            if (retry) {
                takeScreenshot(driver, "firstAttempt-app-" + applicationName + "-hasAccess-" + userHasAccess);
                userCanViewApp(driver, applicationName, userHasAccess, false);
            } else {
                takeScreenshot(driver, "lastAttempt-app-" + applicationName + "-hasAccess-" + userHasAccess);
                throw e;
            }
        }
    }

    private void userCanInstantiateFromResourcesPageButton(RemoteWebDriver driver, boolean userHasAccess) {
        String instantiateButtonSelector = "#appbar-component-container>eui-base-v0-button";
        String instantiateText = "Instantiate new";
        String errorMessage = "Instantiate button on resources page is visible when it should not be";
        checkAccessWithText(driver, instantiateButtonSelector, instantiateText, errorMessage, userHasAccess);
    }

    private void userCanOnboardFromPackagesPageButton(RemoteWebDriver driver, boolean userHasAccess) {
        String onboardingButtonSelector = "#packages_onboarding_button";
        String onboardText = "Onboard package";
        String errorMessage = "Onboard package button on resources page is visible when it should not be";
        checkAccessWithText(driver, onboardingButtonSelector, onboardText, errorMessage, userHasAccess);
    }

    private void userCanSeeContextMenu(RemoteWebDriver driver, String menuOptionId, boolean userHasAccess) {
        String idToSearch = "e-context-menu#" + menuOptionId;
        final String errorMessage = "User has access to a context menu that they shouldn't : " + idToSearch;
        checkAccess(driver, idToSearch, errorMessage, userHasAccess);
    }

    private void userHasOptionFromContextMenu(RemoteWebDriver driver, String menuOptionId, String option,
                                              boolean userHasAccess) {
        String idToSearch = "#" + option + "__" + menuOptionId;
        final String errorMessage = "User has access to a context menu option that they shouldn't : " + idToSearch;
        checkAccess(driver, idToSearch, errorMessage, userHasAccess);
    }

    private void userHasBackupOption(RemoteWebDriver driver, String option,
                                     boolean userHasAccess) {
        final String errorMessage = "User has access to a backup menu option that they shouldn't : " + option;
        checkAccess(driver, option, errorMessage, userHasAccess);
    }

    private void checkAccessWithText(RemoteWebDriver driver, String cssSelector, String textContent,
                                     String errorMessage, boolean userHasAccess) {
        if (userHasAccess) {
            waitForElementWithText(driver, cssSelector, textContent);
        } else {
            try {
                waitForElementWithText(driver, cssSelector, textContent);
                fail(errorMessage);
            } catch (ElementNotFoundException e) {
                LOGGER.debug("waitForElementWithText correctly threw ElementNotFoundException", e);
            }
        }
    }

    private void checkAccess(RemoteWebDriver driver, String cssSelector, String errorMessage, boolean userHasAccess) {
        if (userHasAccess) {
            WebElement element = querySelect(driver, cssSelector);
            if (element == null) {
                takeScreenshot(driver, "selector-" + cssSelector + "-hasAccess-true");
            }
            assertThat(element).isNotNull().withFailMessage("Expected element {} to not be null", cssSelector); // NOSONAR
        } else {
            if (querySelect(driver, cssSelector, 1000, 250) != null) {
                takeScreenshot(driver, "selector-" + cssSelector + "-hasAccess-false");
                fail(errorMessage + cssSelector);
            }
        }
    }

    private static void rbacLogoutWithRetry(RemoteWebDriver driver, boolean retry) {
        try {
            rbacLogout(driver);
        } catch (Exception e) {
            LOGGER.warn("RBAC logout failed due to {}", e.getMessage());
            if (retry) {
                manualSleep(2000);
                rbacLogoutWithRetry(driver, false);
            } else {
                takeScreenshot(driver, "rbac-logoutFailure");
                throw e;
            }
        }
    }

    private static void rbacLogout(RemoteWebDriver driver) {
        LOGGER.info("Run RBAC logout page: {}", RBAC_LOGOUT_URL);
        driver.get(RBAC_LOGOUT_URL);
        manualSleep(2000);
        driver.get(RBAC_LOGOUT_URL);
        manualSleep(2000);
        driver.get(getHost());
        manualSleep(2000);
        checkOnKeycloakPage(driver);
    }
}
