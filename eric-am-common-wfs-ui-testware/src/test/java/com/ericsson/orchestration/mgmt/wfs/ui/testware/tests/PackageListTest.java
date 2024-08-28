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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.additionalAttributesFilterSearch;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkRowSelected;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickBreadCrumb;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickGoToDetailsPageMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickOnInfoIcon;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeFlyout;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openAdditionalAttributesTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.openGeneralInfoTab;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.sortColumn;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyFlyoutIsEmpty;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyFlyoutIsHidden;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyTableHeaders;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyTableHeadersWithRetry;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyTableMatchesFlyout;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.waitForElementWithText;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NO_PACKAGE_SELECTED;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PACKAGE_TABLE_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SGSN_PACKAGE_NAME;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.TABLE_ROW_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.USAGE_STATE_FALSE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.USAGE_STATE_TRUE;

import java.time.Duration;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

public class PackageListTest extends UITest {

    private static final String ERICSSON = "Ericsson";
    private static final String SERVER_SERVICE_CLUSTER_IP = "server.service.clusterIP";

    @Test(dataProvider = "driver")
    public void packageListFlow(String version, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));

        loadApplication(PACKAGES, driver);
        driver.manage().window().maximize();
        verifyTableHeaders(driver);
        assertThat(driver.getCurrentUrl()).contains("#packages");
        waitForElementWithText(driver, "div[column=appProvider]", ERICSSON);

        clickFullTableRow(PACKAGE_TABLE_ID,"1", driver);
        assertThat(checkRowSelected("1", false, driver)).isTrue();

        clickFullTableRow(PACKAGE_TABLE_ID, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isTrue();
        assertThat(checkRowSelected("1", false, driver)).isFalse();

        clickFullTableRow(PACKAGE_TABLE_ID, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isFalse();

        verifyFlyoutIsHidden(driver);
        clickOnInfoIcon(driver);
        verifyFlyoutIsEmpty(NO_PACKAGE_SELECTED, driver);
        closeFlyout(driver, wait);

        WebElement packageNameLink = querySelect(driver, ".custom-table__cell_value");
        assertThat(packageNameLink).isNotNull();
        assertThat(packageNameLink.getText()).isEqualTo(verifyPackageNameForRow("1", driver));
        wait.until(ExpectedConditions.elementToBeClickable(packageNameLink));
        packageNameLink.click();

        assertThat(driver.getCurrentUrl()).contains("#package-details?id=d3def1ce-4cf4-477c-aab3-21cb04e6a381");

        WebElement fullDetailsPageTitle = waitForElementWithText(driver, ".tile__header__left__title", "Details", 5000,
                1000);
        assertThat(fullDetailsPageTitle).isNotNull();

        WebElement fullDetailsPageSubTitle = waitForElementWithText(driver, ".tile__header__left__subtitle",
                SGSN_PACKAGE_NAME, 5000, 1000);
        assertThat(fullDetailsPageSubTitle).isNotNull();

        WebElement appSoftwareVersion = waitForElementWithText(driver, "#appSoftwareVersion .divTableCell",
                "1.20 (CXS101289_R81E08)", 5000, 2000);
        assertThat(appSoftwareVersion).isNotNull();

        clickBreadCrumb(driver, wait,"packages");
        verifyTableHeadersWithRetry(driver);
        assertThat(driver.getCurrentUrl()).contains("#packages");
        assertThat(querySelect(driver, "e-custom-cell[column=appCompositeName]")).isNotNull();
        assertThat(querySelect(driver, "e-custom-cell-state[column=onboardingState]")).isNotNull();

        clickFullTableRow(PACKAGE_TABLE_ID, "7", driver);
        wait.until(item -> checkRowSelected("7", false, driver));

        verifyFlyoutIsHidden(driver);
        clickOnInfoIcon(driver);
        verifyFlyoutContentForTableRow("7", driver);
        verifyContextMenu(driver, "#details e-context-menu");
        closeContextMenu(driver);
        openGeneralInfoTab(driver);

        openAdditionalAttributesTab(driver);

        sortColumn(driver, "parameter", SERVER_SERVICE_CLUSTER_IP, "day0.configuration.secrets");
        sortColumn(driver, "value", "", "0");
        additionalAttributesFilterSearch(driver, "ip", "2");

        openGeneralInfoTab(driver);

        closeFlyout(driver, wait);

        clickFullTableRow(PACKAGE_TABLE_ID, "1", driver);
        wait.until(item -> checkRowSelected("1", false, driver));

        sortColumn(driver, "appCompositeName",
                SGSN_PACKAGE_NAME,
                SGSN_PACKAGE_NAME);
        sortColumn(driver, "appCompositeName",
                SGSN_PACKAGE_NAME,
                "Ericsson.vMME.0.40 (CXS101289_R81E09).cxp9025899");
        sortColumn(driver, "appProductName", "vMME", "SGSN-MME");
        sortColumn(driver, "appSoftwareVersion", "1.20 (CXS101289_R81E08)", "0.40 (CXS101289_R81E09)");
        sortColumn(driver, "descriptorVersion", "cxp9025899", "cxp9025898_4r81e08");
        sortColumn(driver, "onboardingState",  "Onboarded", "Created");
        sortColumn(driver, "onboardingState",  "Created", "Uploading");
        sortColumn(driver, "usageState", USAGE_STATE_FALSE, USAGE_STATE_TRUE);
        sortColumn(driver, "usageState", USAGE_STATE_TRUE, USAGE_STATE_FALSE);
        sortColumn(driver, "appProvider", ERICSSON, ERICSSON);
        sortColumn(driver, "packageSecurityOptionString", "", "");

        // ONBOARDED/NOT_IN_USE
        verifyContextMenu(driver, ".custom-table__cell #row-d3def1ce-4cf4-477c-aab3-21cb04e6a386");
        clickGoToDetailsPageMenuItem(driver, ".custom-table__cell #row-d3def1ce-4cf4-477c-aab3-21cb04e6a386");
        assertThat(driver.getCurrentUrl()).contains("#package-details?id=d3def1ce-4cf4-477c-aab3-21cb04e6a386");

        WebElement fullDetailsTitle = waitForElementWithText(driver, ".tile__header__left__title", "Details", 5000,
                1000);
        assertThat(fullDetailsTitle).isNotNull();

        WebElement fullDetailsSubTitle = waitForElementWithText(driver, ".tile__header__left__subtitle",
                "Ericsson.SGSN-MME.1.20 (CXS101289_R81E10).cxp9025898_4r81e10", 5000, 1000);
        assertThat(fullDetailsSubTitle).isNotNull();
        WebElement softwareVersionDetails = querySelect(driver, "#appSoftwareVersion");
        assertThat(softwareVersionDetails).isNotNull();
        assertThat(softwareVersionDetails.getText()).contains("Software version", "1.20 (CXS101289_R81E10)");

        WebElement securityOption = querySelect(driver, "#packageSecurityOption");
        assertThat(securityOption).isNotNull();
        assertThat(securityOption.getText()).contains("Security option", "");

        openAdditionalAttributesTab(driver);
        assertThat((querySelect(driver, "#parameter")).getText()).isEqualTo("Parameter");
        assertThat((querySelect(driver, "div[column=value]")).getText()).isEqualTo("");
        additionalAttributesFilterSearch(driver, "server.service", "4");

        sortColumn(driver, "parameter", SERVER_SERVICE_CLUSTER_IP, SERVER_SERVICE_CLUSTER_IP);
        sortColumn(driver, "value", "", "2009-12-01");
    }

    private static String verifyPackageNameForRow(String tableRow, RemoteWebDriver driver) {
        WebElement tableRowPackageName = querySelect(driver, TABLE_ROW_SELECTOR + tableRow + ") td:nth-child(1) .custom-table__cell_value");
        assertThat(tableRowPackageName).isNotNull();
        assertThat(tableRowPackageName.getText()).isNotNull();
        return tableRowPackageName.getText();
    }

    public static void clickFullTableRow(String tableId, String row, RemoteWebDriver driver) {
        WebElement tableRow = querySelect(driver, "e-generic-table#" + tableId + TABLE_ROW_SELECTOR + row + ") td:nth-child(2)");
        assertThat(tableRow).isNotNull();
        tableRow.click();
    }

    private static void verifyFlyoutContentForTableRow(String tableRow, RemoteWebDriver driver) {
        String packageName = verifyPackageNameForRow(tableRow, driver);

        WebElement packageDetails = querySelect(driver, "e-details-side-panel eui-layout-v0-tabs eui-layout-v0-tab");
        assertThat(packageDetails).isNotNull();

        WebElement flyoutPackageName = querySelect(driver, "#details .tile__header__left__subtitle");
        assertThat(flyoutPackageName).isNotNull();
        assertThat(flyoutPackageName.getText()).isNotNull();
        assertThat(packageName).isEqualTo(flyoutPackageName.getText());

        verifyTableMatchesFlyout(tableRow, "2", "#type", driver);
        verifyTableMatchesFlyout(tableRow, "3", "#appSoftwareVersion", driver);
        verifyTableMatchesFlyout(tableRow, "4", "#descriptorVersion", driver);
        verifyTableMatchesFlyout(tableRow, "5", "#appProvider", driver);
        verifyTableMatchesFlyout(tableRow, "7", "#usageState", driver);

        WebElement flyoutDescription = querySelect(driver, "#description .divTableCellDesc");
        assertThat(flyoutDescription).isNotNull();
    }
}
