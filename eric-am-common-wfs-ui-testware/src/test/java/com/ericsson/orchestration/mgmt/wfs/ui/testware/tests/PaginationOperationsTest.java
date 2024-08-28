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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.checkSubtitle;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.clickPaginationArrow;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.loadApplication;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.querySelectAll;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.takeScreenshot;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyTableIsPaginated;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyTableRowsSelectedAndDeselected;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.CommonSteps.verifyViewIsPaginated;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS_TABLE_ID;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.OPERATIONS_URL_PART;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.TABLE_SELECTOR;

import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

public class PaginationOperationsTest extends UITest {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaginationOperationsTest.class);

    private static final int NUMBER_OF_OPERATIONS_PER_PAGE = 15;
    private static final int NUMBER_OF_OPERATIONS_LAST_PAGE = 3;
    private static final int NUMBER_OF_OPERATIONS_TOTAL = 18;
    public static final String PAGE_NUMBER_FIRST = "1";
    public static final String PAGE_NUMBER_LAST = "2";
    public static final String TABLE_ROWS_SELECTOR = TABLE_SELECTOR + OPERATIONS_TABLE_ID + " tbody tr";
    public static final String SCREENSHOT_FILE_PREFIX = "operations_pagination_test_";

    @Test(dataProvider = "driver")
    public void paginatedOperations(String version, RemoteWebDriver driver) {

        try {
            LOGGER.info("Load Operations page and check uri contains {}", OPERATIONS_URL_PART);
            loadApplication(OPERATIONS, driver);
            driver.manage().window().maximize();
            assertThat(driver.getCurrentUrl()).contains(OPERATIONS_URL_PART);

            LOGGER.info("Verify that Operations are displayed on the Operations page");
            List<WebElement> tableRows = querySelectAll(driver, TABLE_ROWS_SELECTOR);
            assertThat(tableRows).isNotNull();
            assertThat(tableRows.size()).isEqualTo(NUMBER_OF_OPERATIONS_PER_PAGE);
            verifyTableRowsSelectedAndDeselected(driver, OPERATIONS_TABLE_ID);

            LOGGER.info("Verify that Operations view is paginated");
            verifyViewIsPaginated(driver, PAGE_NUMBER_FIRST, PAGE_NUMBER_LAST, NUMBER_OF_OPERATIONS_PER_PAGE, NUMBER_OF_OPERATIONS_TOTAL);
            verifyTableIsPaginated(driver, PAGE_NUMBER_FIRST, PAGE_NUMBER_LAST, NUMBER_OF_OPERATIONS_LAST_PAGE, NUMBER_OF_OPERATIONS_TOTAL, TABLE_ROWS_SELECTOR);

            LOGGER.info("Click 'Next Page' arrow");
            String rightArrowSelector = "eui-pagination-v0 i.icon.icon-arrow-right eui-v0-icon";
            clickPaginationArrow(driver, "2", rightArrowSelector);
            checkSubtitle(driver, String.format("(%d - %d of %d)", NUMBER_OF_OPERATIONS_PER_PAGE + 1, NUMBER_OF_OPERATIONS_TOTAL, NUMBER_OF_OPERATIONS_TOTAL));

            LOGGER.info("Click 'Previous Page' arrow");
            String leftArrowSelector = "eui-pagination-v0 i.icon.icon-arrow-left eui-v0-icon";
            clickPaginationArrow(driver, "1", leftArrowSelector);
            checkSubtitle(driver, String.format("(1 - %d of %d)", NUMBER_OF_OPERATIONS_PER_PAGE, NUMBER_OF_OPERATIONS_TOTAL));
        } catch (Exception e) {
            takeScreenshot(driver, SCREENSHOT_FILE_PREFIX + version);
            throw e;
        }
    }

}
