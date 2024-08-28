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
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelect;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

import com.ericsson.orchestration.mgmt.wfs.ui.testware.api.Navigation;

import java.time.Duration;

public class DocumentationTest extends UITest {
    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentationTest.class);

    @Ignore
    @Test(dataProvider = "driver")
    public void documentationFlow(String version, RemoteWebDriver driver) {
        driver.manage().window().maximize();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));

        String selector = ".documentation-system-bar-help-content";
        wait.until(item -> querySelect(driver, selector) != null);
        WebElement documentIcon = querySelect(driver, selector);
        documentIcon.click();

        Navigation.openBrowserTab(driver, 1);
        LOGGER.info("Verify Document Title");
        WebElement descriptionPlaceholder = querySelect(driver, "#evnfmuiuserguide");
        assertThat(descriptionPlaceholder.getText()).isEqualTo("E-VNFM UI User Guide");

        wait.until((item) -> querySelect(driver, ".converted-data") != null);
    }
}
