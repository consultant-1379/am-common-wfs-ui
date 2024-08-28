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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.*;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillOutWizardValue;
import static org.assertj.core.api.Assertions.assertThat;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FINISH_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NEXT_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PERSIST_SCALE_INFO_CHECKBOX_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_4_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SEE_RESOURCE_LIST_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SKIP_MERGING_PREVIOUS_VALUES_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.UPGRADE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VMME_PACKAGE_NAME;

import java.time.Duration;
import java.util.Map;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class UpgradeResourceTest extends UITest{

    private static final Logger LOGGER = LoggerFactory.getLogger(UpgradeResourceTest.class);

    private static final String UPGRADE_RESOURCE_WITH_LIST_MAP_MENU_SELECTOR = ".custom-table__cell #" + RESOURCE_4_ID;
    private static final String UPGRADE_OPERATION_STARTED_DIALOG_SELECTOR = "div[class=\"dialog__title\"]";
    private static final String UPGRADE_OPERATION_STARTED_DIALOG_TEXT = "Upgrade operation started";
    private static final String CHECKED_ATTRIBUTE = "checked";

    @Test(dataProvider = "driver")
    public void upgradeFlow(String version, RemoteWebDriver driver){

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        loadApplication(RESOURCES, driver);
        driver.manage().window().maximize();

        LOGGER.info("Starting Upgrade operation for the resource to check that list and map types are supported for Additional parameters");
        clickContextMenuItem(driver, wait, UPGRADE_RESOURCE_WITH_LIST_MAP_MENU_SELECTOR, UPGRADE);

        LOGGER.info("Upgrade Step 1 - Package Selection - Select package with list and map types in vnfd for Change Package Info "
                            + "operation");
        clickTableRowPackagesByName(driver, VMME_PACKAGE_NAME);
        querySelect(driver, NEXT_BUTTON).click();

        LOGGER.info("Upgrade Step 2 - Infrastructure");
        querySelect(driver, NEXT_BUTTON).click();

        LOGGER.info("Upgrade Step 3 - General attributes");
        checkPropertyOfDefaultTrueCheckbox(driver, PERSIST_SCALE_INFO_CHECKBOX_SELECTOR);
        checkPropertyOfDefaultFalseCheckbox(driver, SKIP_MERGING_PREVIOUS_VALUES_SELECTOR);
        querySelect(driver, NEXT_BUTTON).click();

        LOGGER.info("Upgrade Step 4 - Additional attributes");
        fillOutWizardValue(driver, "server.service.clusterIP", "127.0.0.1");
        fillOutWizardValue(driver, "server.service.loadBalancerIP", "127.0.0.2");
        Map<String, String> expectedResultsMapForUpgrade = getAdditionalAttributesValuesFromAdditionalAttributesStep(driver);
        querySelect(driver, NEXT_BUTTON).click();

        LOGGER.info("Upgrade Step 5 - Summary.");
        Map<String, String> actualAttributes = getAdditionalAttributes(driver);
        expectedResultsMapForUpgrade.forEach((key, value) -> {
            LOGGER.info("Key value pair: {}, {}", key, value);
            assertThat(actualAttributes.containsKey(key)).isTrue();
            assertThat(actualAttributes.get(key)).isEqualTo(value);
        });
        querySelect(driver, FINISH_BUTTON).click();

        LOGGER.info("Checking that popup with text Upgrade operation started appears.");
        waitForElementWithText(driver, UPGRADE_OPERATION_STARTED_DIALOG_SELECTOR, UPGRADE_OPERATION_STARTED_DIALOG_TEXT, 20000, 2000);
        querySelect(driver, SEE_RESOURCE_LIST_BUTTON_SELECTOR).click();

        LOGGER.info("checking that the Resources page is opened");
        assertThat(driver.getCurrentUrl()).contains(RESOURCES_URL_PART);
    }

    private static void checkPropertyOfDefaultTrueCheckbox(RemoteWebDriver driver, String selector) {
        WebElement checkbox = querySelect(driver, selector);
        assertThat(checkbox.getAttribute(CHECKED_ATTRIBUTE)).isEqualTo(Boolean.TRUE.toString());
        scrollIntoView(driver, checkbox);
        checkbox.click();
        assertThat(checkbox.getAttribute(CHECKED_ATTRIBUTE)).isNull();
    }

    private static void checkPropertyOfDefaultFalseCheckbox(RemoteWebDriver driver, String selector) {
        WebElement checkbox = querySelect(driver, selector);
        assertThat(checkbox.getAttribute(CHECKED_ATTRIBUTE)).isNull();
        scrollIntoView(driver, checkbox);
        checkbox.click();
        assertThat(checkbox.getAttribute(CHECKED_ATTRIBUTE)).isEqualTo(Boolean.TRUE.toString());
    }
}
