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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkContextMenuOptionNotPresentForResource;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickContextMenuItem;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.closeContextMenu;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.fillOutWizardValueTextArea;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyRadioButtonsOnlyFirstChecked;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ASPECT1_CISM_CONTROLLED_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ASPECT1_MANUAL_CONTROLLED_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DESCRIPTION_PLACEHOLDER_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MODIFY_VNF_INFO;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_2_CONTEXT_MENU_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCE_8_ID;

import java.time.Duration;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

/*******************************************************************************
 * COPYRIGHT Ericsson 2020
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
public class ModifyVnfInfoTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(ModifyVnfInfoTest.class);
    private static final String MODIFY_VNF_INFO_PREFIX = "#Modify-VNF-Information__";
    private static final String MODIFY_BUTTON_SELECTOR = "eui-base-v0-button#Modify";

    @Test(dataProvider = "driver")
    public void testModifyVnfInfoResource(String version, RemoteWebDriver driver) {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        loadApplication(RESOURCES, driver);
        driver.manage().window().maximize();

        LOGGER.info("Clicking context menu and checking modify vnf option not present for resource 8 (in failed_temp state)");
        checkContextMenuOptionNotPresentForResource(driver, RESOURCE_8_ID, MODIFY_VNF_INFO_PREFIX);
        closeContextMenu(driver);

        LOGGER.info("Clicking context menu and checking modify vnf option present for resource 2");
        clickContextMenuItem(driver, wait, RESOURCE_2_CONTEXT_MENU_SELECTOR, MODIFY_VNF_INFO);

        LOGGER.info("Fill and check description textArea");
        fillOutWizardValueTextArea(driver, DESCRIPTION_PLACEHOLDER_SELECTOR, "testing");

        LOGGER.info("Checking and setting extensions");
        verifyRadioButtonsOnlyFirstChecked(driver, ASPECT1_CISM_CONTROLLED_ID, ASPECT1_MANUAL_CONTROLLED_ID);
        CommonSteps.clickRadioButton(driver, ASPECT1_MANUAL_CONTROLLED_ID);
        verifyRadioButtonsOnlyFirstChecked(driver, ASPECT1_MANUAL_CONTROLLED_ID, ASPECT1_CISM_CONTROLLED_ID);

        LOGGER.info("Selecting Modify button");
        WebElement modifyButton = querySelect(driver, MODIFY_BUTTON_SELECTOR);
        modifyButton.click();

        LOGGER.info("Checking modify notification is displayed");
        WebElement modificationInProgress = querySelect(driver, ".notification");
        assertThat(modificationInProgress.isDisplayed()).isTrue();
        driver.navigate().refresh();
    }
}
