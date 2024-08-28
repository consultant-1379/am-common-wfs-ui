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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import java.util.List;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.*;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.*;
import static org.assertj.core.api.Assertions.assertThat;

public class PaginationResourcesTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaginationResourcesTest.class);

    private static final int NUMBER_OF_RESOURCES_PER_PAGE = 15;
    private static final int NUMBER_OF_RESOURCES_LAST_PAGE = 3;
    private static final int NUMBER_OF_RESOURCES_TOTAL = 18;
    public static final String PAGE_NUMBER_FIRST = "1";
    public static final String PAGE_NUMBER_LAST = "2";
    public static final String TABLE_ROWS_SELECTOR = TABLE_SELECTOR + RESOURCES_TABLE_ID + " tbody tr";
    public static final String SCREENSHOT_FILE_PREFIX = "resources_pagination_test_";

    @Test(dataProvider = "driver")
    public void paginatedResources(String version, RemoteWebDriver driver) {

        try {
            LOGGER.info("Load Resources page and check uri contains {}", RESOURCES_URL_PART);
            loadApplication(RESOURCES, driver);
            driver.manage().window().maximize();
            assertThat(driver.getCurrentUrl()).contains(RESOURCES_URL_PART);

            LOGGER.info("Verify that resources are displayed on the Resources page");
            List<WebElement> tableRows = querySelectAll(driver, TABLE_ROWS_SELECTOR);
            assertThat(tableRows).isNotNull();
            assertThat(tableRows.size()).isEqualTo(NUMBER_OF_RESOURCES_PER_PAGE);
            verifyTableRowsSelectedAndDeselected(driver, RESOURCES_TABLE_ID);

            LOGGER.info("Verify that resources view is paginated");
            verifyViewIsPaginated(driver, PAGE_NUMBER_FIRST, PAGE_NUMBER_LAST, NUMBER_OF_RESOURCES_PER_PAGE, NUMBER_OF_RESOURCES_TOTAL);
            verifyTableIsPaginated(driver, PAGE_NUMBER_FIRST, PAGE_NUMBER_LAST, NUMBER_OF_RESOURCES_LAST_PAGE, NUMBER_OF_RESOURCES_TOTAL, TABLE_ROWS_SELECTOR);

            LOGGER.info("Click 'Next Page' arrow");
            String rightArrowSelector = "eui-pagination-v0 i.icon.icon-arrow-right eui-v0-icon";
            clickPaginationArrow(driver, "2", rightArrowSelector);
            checkSubtitle(driver, String.format("(%d - %d of %d)", NUMBER_OF_RESOURCES_PER_PAGE + 1, NUMBER_OF_RESOURCES_TOTAL, NUMBER_OF_RESOURCES_TOTAL));

            LOGGER.info("Click 'Previous Page' arrow");
            String leftArrowSelector = "eui-pagination-v0 i.icon.icon-arrow-left eui-v0-icon";
            clickPaginationArrow(driver, "1", leftArrowSelector);
            checkSubtitle(driver, String.format("(1 - %d of %d)", NUMBER_OF_RESOURCES_PER_PAGE, NUMBER_OF_RESOURCES_TOTAL));
        } catch (Exception e) {
            takeScreenshot(driver, SCREENSHOT_FILE_PREFIX + version);
            throw e;
        }
    }

}
