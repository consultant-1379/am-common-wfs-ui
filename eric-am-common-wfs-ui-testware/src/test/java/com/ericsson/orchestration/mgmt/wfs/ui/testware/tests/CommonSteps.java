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
import static org.junit.jupiter.api.Assertions.fail;
import static org.testng.AssertJUnit.assertEquals;

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ADDITIONAL_ATTRIBUTES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ADDITIONAL_ATTRIBUTES_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.BACKUPS_TAB_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DEPLOYABLE_MODULES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DEPLOYABLE_MODULE_DISABLED;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DUPLICATE_KEY_ERROR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.DUPLICATE_SECRET_NAME_ERROR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.EMPTY_KEY_AND_VALUE_TEXTFIELD;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.EMPTY_KEY_WARNING;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.EMPTY_VALUE_WARNING;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ENTRY_SCHEMA_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.EXTEND_ADDITIONAL_ATTRIBUTES_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FIRST_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FIRST_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.FIRST_DEPLOYABLE_MODULE_KEY;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.GO_TO_DETAILS;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INCORRECT_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INSTANTIATE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_JSON_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_JSON_FORMAT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.INVALID_VALUES_YAML;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.LIST_OF_LISTS_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.LIST_OF_MAPS_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.LIST_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MAP_OF_LISTS_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MAP_OF_MAPS_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MAP_TYPE_ADD_ATTRIBUTE_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_CARDS_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_CARD_ADD_KV_PAIR_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_CARD_WARNING_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_CHEVRON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_DELETE_CARD_BUTTON_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_DELETE_KEY_VALUE_PAIR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_FILE_UPLOAD_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_HIDDEN_EYE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_KEY_FIELD_ERROR_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_KEY_TEXTFIELD;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_KV_PAIR_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_SECRET_NAME_ERROR_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_SECRET_NAME_TEXTFIELD;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_SUBTITLE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_VALUE_FIELD_ERROR_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_VALUE_TEXTFIELD;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_VALUE_TEXTFIELD_CLEAR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.MULTI_SECRET_VALUE_TEXTFIELD_STATE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NEXT_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_LIST_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.NOT_MAP_TYPE_ERROR_TEXT;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PAGINATION_CURRENT_PAGE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PAGINATION_NUM_PAGES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PAGINATION_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.PREVIOUS_BUTTON;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.RESOURCES;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SECOND_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SECOND_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.SECOND_DEPLOYABLE_MODULE_KEY;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.TABLE_ROW_SELECTOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_LIST_OF_LISTS_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_LIST_OF_MAPS_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_LIST_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_MAP_OF_LISTS_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_MAP_OF_MAPS_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_MAP_VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALID_VALUES_YAML;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALUE;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.VALUES_YAML_SELECTOR;

import static wiremock.org.apache.commons.io.FileUtils.copyFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.Nullable;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.qameta.allure.Step;

public class CommonSteps {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommonSteps.class);
    private static final String ADDITIONAL_ATTRIBUTE_KEY_SUMMARY_STEP_SELECTOR = ".summary-key";
    private static final String ADDITIONAL_ATTRIBUTE_VALUE_SUMMARY_STEP_SELECTOR = ".summary-value";
    private static final String ADDITIONAL_ATTRIBUTE_TEXT_FIELD_ADDITIONAL_ATTRIBUTES_STEP_SELECTOR = "div.centeredParent div.table div.tr div.td"
            + ".paddingInputTd div.input eui-base-v0-text-field.editAttribute";
    private static final String INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR = ".errorMessage.applicationTimeOut.invalidTimeout";
    private static final String MISSING_PASSWORD_ERROR_MESSAGE_SELECTOR = ".errorMessage.restorePassword.missingPassword";
    private static final String INVALID_TIMEOUT_ERROR_MESSAGE = "Invalid Timeout";
    private static final String MISSING_PASSWORD_ERROR_MESSAGE = "Restore password should be specified";
    private static final String DISABLED = "disabled";
    private static final String SIDE_PANEL_BACKUPS_TAB_SELECTOR = "#resourceBackups";
    private static final String SIDE_PANEL_RIGHT_ARROW_SELECTOR = ".eui__tabs__titles__right__arrow";
    private static final String SIDE_PANEL_LEFT_ARROW_SELECTOR = ".eui__tabs__titles__left__arrow";
    private static final String VALUE_ATTR = "value";
    private static final String CHECKED = "checked";

    public static final String COMBO_BOX_ITEM_SELECTOR = "div[menu-item]";
    public static final String RADIO_BUTTON_SELECTOR = "eui-base-v0-radio-button";
    public static final String CLUSTER_DROPDOWN = "e-generic-combo-box#cluster-name";
    public static final String CLUSTER_DROPDOWN_SELECTED = ".dropdown > eui-base-v0-text-field";
    public static final String CLUSTER_INPUT_FIELD = "input#item.input.textfield.with-icon";
    public static final String CLUSTER_DROPDOWN_MENU_SELECTOR = "e-generic-combo-box#cluster-name div[menu-item]";
    public static final String FALSE = "false";

    private CommonSteps() {
    }

    static void manualSleep(long millis) {
        LOGGER.info("Sleeping for {} milliseconds", millis);
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            LOGGER.error("InterruptedException during manualSleep", e);
        }
    }

    @Step("Open application from menu")
    static void loadApplication(String applicationName, RemoteWebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        WebElement openAppNavigationFlyOutButton = querySelect(driver, "#AppBar-menu-toggle");
        if (openAppNavigationFlyOutButton != null) {
            openAppNavigationFlyOutButton.click();
        }

        querySelect(driver, "eui-base-v0-tree");
        manualSleep(4000); // sleep used to deal with SDK flyout
        ArrayList<WebElement> listOfApplications = querySelectAll(driver, "eui-base-v0-tree-item");
        for (WebElement webElement : listOfApplications) {
            if (webElement.getAttribute("innerText").equalsIgnoreCase(applicationName)) {
                wait.until(ExpectedConditions.elementToBeClickable(webElement));
                webElement.click();
                waitForElementWithText(driver, ".current-page", applicationName, 10000, 1000);
                WebElement closeAppNavigationFlyOutButton = querySelect(driver, "#AppBar-menu-toggle");
                WebElement menuPanel = querySelect(driver, "eui-app-nav");
                if (closeAppNavigationFlyOutButton != null) {
                    closeAppNavigationFlyOutButton.click();
                    wait.until(ExpectedConditions.invisibilityOf(menuPanel));
                }
                return;
            }
        }
        throw new RuntimeException("Could not open application from application list"); // NOSONAR
    }

    static Boolean checkRowSelected(String row, Boolean checkboxSelector, RemoteWebDriver driver) {
        WebElement rowSelected;
        String selectedOrChecked;
        if (Boolean.TRUE.equals(checkboxSelector)) {
            rowSelected = querySelect(driver, TABLE_ROW_SELECTOR + row + ") td eui-base-v0-checkbox");
            selectedOrChecked = CHECKED;
        } else {
            rowSelected = querySelect(driver, TABLE_ROW_SELECTOR + row + ")");
            selectedOrChecked = "selected";
        }
        assertThat(rowSelected).isNotNull();
        return rowSelected.getAttribute(selectedOrChecked) != null; //NOSONAR
    }

    static void clickBackupsTab(RemoteWebDriver driver) {
        WebElement backupsTab = querySelect(driver, BACKUPS_TAB_SELECTOR);
        assertThat(backupsTab).isNotNull();
        backupsTab.click(); //NOSONAR
    }

    static void clickBreadCrumb(RemoteWebDriver driver, WebDriverWait wait, String breadCrumbPath) {
        String breadCrumbSelector = String.format("a[data-path=\"%s\"]", breadCrumbPath);
        Optional<WebElement> breadCrumb = Optional.ofNullable(querySelect(driver, breadCrumbSelector));
        breadCrumb.ifPresentOrElse(webElement -> wait.until(ExpectedConditions.elementToBeClickable(webElement)).click(),
                                   () -> fail("Cannot find the breadcrumb"));
    }

    static void takeScreenshot(RemoteWebDriver driver) {
        String imageName = System.currentTimeMillis() + ".png";
        takeScreenshot(driver, imageName);
    }

    static void takeScreenshot(RemoteWebDriver driver, String imageName) {
        try {
            LOGGER.info("Creating screenshot {}-{}.png", imageName, System.currentTimeMillis());
            imageName += "-" + System.currentTimeMillis() + ".png";
            File src = driver.getScreenshotAs(OutputType.FILE);
            copyFile(src, new File("./target/screenshots/" + imageName));
        } catch (Exception e) {
            LOGGER.error("Failed to take a snapshot due to {}", e.getMessage());
        }
    }

    static WebElement waitForElementWithText(RemoteWebDriver driver, String selector, String textContent) {
        return waitForElementWithText(driver, selector, textContent, 5000, 1000, true);
    }

    static WebElement waitForElementWithText(RemoteWebDriver driver, String selector, String textContent, long totalTime, long interval) {
        return waitForElementWithText(driver, selector, textContent, totalTime, interval, true);
    }

    static WebElement waitForElementContainingText(RemoteWebDriver driver, String selector, String textContent) {
        return waitForElementWithText(driver, selector, textContent, 5000, 1000, false);
    }

    private static WebElement waitForElementWithText(RemoteWebDriver driver, String selector, String textContent,
                                                     long totalTime, long interval, boolean exactMatch) {
        long startTime = System.currentTimeMillis();
        boolean firstLoop = true;
        do {
            if (firstLoop) {
                firstLoop = false;
            } else {
                manualSleep(interval);
            }
            ArrayList<WebElement> elements = new ArrayList<>();
            try {
                elements = querySelectAll(driver, selector);
            } catch (Exception e) {
                LOGGER.warn("Could not retrieve element {}. Exception occured : {}", selector, e.getMessage());
            }
            int elementsSize = 0;
            if (elements != null) {
                elementsSize = elements.size();
            }
            LOGGER.info("Found {} elements matching {} checking for textContent '{}'", elementsSize, selector,
                        textContent);
            if (elements != null && !elements.isEmpty()) {
                WebElement element;
                if (exactMatch) {
                    element = getWebElementText(textContent, elements);
                } else {
                    element = getWebElementContainingText(textContent, elements);
                }
                if (element != null) {
                    return element;
                }
            } else {
                LOGGER.warn("Element '{}' not found yet", selector);
            }
        } while ((System.currentTimeMillis() - startTime) < totalTime);
        throw new ElementNotFoundException("Element " + selector + " with text content " + textContent + " not found"); // NOSONAR
    }

    @Nullable
    private static WebElement getWebElementText(String textContent, ArrayList<WebElement> elements) {
        for (WebElement element : elements) {
            LOGGER.info("Element text = {}", element.getAttribute("innerText"));
            if (element.getAttribute("innerText").trim().equalsIgnoreCase(textContent)) {
                return element;
            }
        }
        return null;
    }

    @Nullable
    private static WebElement getWebElementContainingText(String textContent, ArrayList<WebElement> elements) {
        for (WebElement element : elements) {
            LOGGER.info("Element text = {}", element.getAttribute("innerText"));
            if (element.getAttribute("innerText").trim().contains(textContent)) {
                return element;
            }
        }
        return null;
    }

    static WebElement querySelect(RemoteWebDriver driver, String selector, int totalTime, int interval) {
        return (WebElement) querySelect(driver, selector, true, totalTime, interval);
    }

    static WebElement querySelect(RemoteWebDriver driver, String selector) {
        return (WebElement) querySelect(driver, selector, true, 5000, 1000);
    }

    static WebElement querySelect(RemoteWebDriver driver, String selector, long totalTime, long interval) {
        return (WebElement) querySelect(driver, selector, true, totalTime, interval);
    }

    static ArrayList<WebElement> querySelectAll(RemoteWebDriver driver, String selector) {
        return (ArrayList<WebElement>) querySelect(driver, selector, false, 5000, 1000);
    }

    public static Object querySelect(RemoteWebDriver driver, String selector, boolean returnFirstFound) {
        return querySelect(driver, selector, returnFirstFound, 5000, 1000);
    }

    private static Object querySelect(RemoteWebDriver driver, String selector, boolean returnFirstFound, long totalTime,
                                      long interval) {
        long startTime = System.currentTimeMillis();
        boolean firstLoop = true;
        do {
            if (firstLoop) {
                firstLoop = false;
            } else {
                manualSleep(interval);
            }
            Object element = null;
            try {
                LOGGER.info("Query select for '{}' returnFirstFound: {}", selector, returnFirstFound);
                if (returnFirstFound) {
                    element = driver.executeScript(" return window.querySelectorDeep('" + selector + "');");
                } else {
                    element = driver.executeScript(" return window.querySelectorAllDeep('" + selector + "');");
                }
            } catch (Exception e) {
                LOGGER.warn("Could not retrieve element {}. Exception occured : {}", selector, e.getMessage());
            }
            if (returnFirstFound && element != null) {
                return element;
            } else if (!returnFirstFound && element != null && !((ArrayList) element).isEmpty()) {
                return element;
            } else {
                LOGGER.warn("Element '{}' not found yet", selector);
            }
        } while ((System.currentTimeMillis() - startTime) < totalTime);
        LOGGER.warn("Time spent checking for '{}' is {}", selector, System.currentTimeMillis() - startTime);
        return null;
    }

    static void clickTableRowById(RemoteWebDriver driver, String rowId) {
        querySelect(driver, ".common-cell#" + rowId).click(); // NOSONAR
    }

    static void verifyFlyoutIsHidden(RemoteWebDriver driver) {
        WebElement packageDetailsFlyout = querySelect(driver, "#details");
        assertThat(packageDetailsFlyout).isNotNull();
        assertThat(packageDetailsFlyout.getAttribute("hide")).isEqualTo("true"); // NOSONAR
    }

    static void openFlyout(RemoteWebDriver driver) {
        querySelect(driver, "#open-panel-button-details").click(); // NOSONAR
    }

    static void closeFlyout(RemoteWebDriver driver, WebDriverWait wait) {
        closeFlyout(driver, wait, true);
    }

    private static void closeFlyout(RemoteWebDriver driver, WebDriverWait wait, boolean catchExceptionAndRetry) {
        try {
            WebElement flyoutClose = wait.until(ExpectedConditions
                                                        .visibilityOf(querySelect(driver, "#details eui-v0-icon[name=cross]")));
            assertThat(flyoutClose).isNotNull();
            flyoutClose.click();
        } catch (Exception e) {
            if (catchExceptionAndRetry) {
                LOGGER.error("Retrying closing flyout due to: ", e);
                manualSleep(2000);
                closeFlyout(driver, wait, false);
            } else {
                throw e;
            }
        }
    }

    static void verifyFlyoutIsEmpty(String message, RemoteWebDriver driver) {
        WebElement flyoutParagraph = querySelect(driver, "#details p");
        assertThat(flyoutParagraph).isNotNull();
        assertThat(flyoutParagraph.getText()).isNotNull(); // NOSONAR
        assertThat(flyoutParagraph.getText()).isEqualTo(message); // NOSONAR
    }

    static void clickOnInfoIcon(RemoteWebDriver driver) {
        WebElement infoIcon = querySelect(driver, "#open-panel-button-details");
        assertThat(infoIcon).isNotNull();
        infoIcon.click(); // NOSONAR
    }

    static void verifyTableMatchesFlyout(String tableRow, String tableDataPosition, String id,
                                         RemoteWebDriver driver) {
        WebElement tableRowData = querySelect(driver,
                                              TABLE_ROW_SELECTOR + tableRow + ") td:nth-child(" + tableDataPosition + ")");
        assertThat(tableRowData).isNotNull();
        assertThat(tableRowData.getText()).isNotNull(); // NOSONAR

        WebElement flyoutData = querySelect(driver, id + " .divTableCell:nth-child(2)");
        assertThat(flyoutData).isNotNull();
        assertThat(flyoutData.getText()).isNotNull(); // NOSONAR
        assertThat(tableRowData.getText()).isEqualTo(flyoutData.getText());
    }

    static void sortColumn(RemoteWebDriver driver, String columnName,
                           String expectedTextBeforeSort, String expectedTextAfterSort) {
        WebElement icon = querySelect(driver, "#icon-" + columnName);
        assertThat(icon).isNotNull();
        WebElement columnElement = querySelect(driver, "div[column=" + columnName + "]");
        if (columnElement == null) {
            columnElement = querySelect(driver, "e-custom-cell-state[column=" + columnName + "]");
            assertThat(columnElement).isNotNull();
            assertThat(columnElement.getAttribute("cell-value")).isNotNull(); // NOSONAR
            assertThat(columnElement.getAttribute("cell-value")).isEqualTo(expectedTextBeforeSort);
        } else {
            assertThat(columnElement).isNotNull();
            assertThat(columnElement.getText()).isNotNull(); // NOSONAR
        }

        icon.click(); // NOSONAR
        manualSleep(1000);

        WebElement firstColumnElementAfterSort = querySelect(driver,
                                                             "div[column=" + columnName + "]");
        if (firstColumnElementAfterSort == null) {
            firstColumnElementAfterSort = querySelect(driver, "e-custom-cell-state[column=" + columnName + "]");
            assertThat(firstColumnElementAfterSort).isNotNull();
            assertThat(firstColumnElementAfterSort.getAttribute("cell-value")).isNotNull(); // NOSONAR
            assertThat(firstColumnElementAfterSort.getAttribute("cell-value")).isEqualTo(expectedTextAfterSort);
        } else {
            assertThat(firstColumnElementAfterSort).isNotNull();
            assertThat(firstColumnElementAfterSort.getText()).isNotNull(); // NOSONAR
            assertThat(firstColumnElementAfterSort.getText()).isEqualTo(expectedTextAfterSort);
        }
    }

    static void openAdditionalAttributesTab(RemoteWebDriver driver) {
        WebElement detailsTabRightArrow = querySelect(driver, SIDE_PANEL_RIGHT_ARROW_SELECTOR);
        if (detailsTabRightArrow != null && detailsTabRightArrow.isDisplayed()) {
            detailsTabRightArrow.click();
        }
        WebElement attributeTab = querySelect(driver, "#additionalAttributes");
        assertThat(attributeTab).isNotNull();
        attributeTab.click(); // NOSONAR
    }

    static void openGeneralInfoTab(RemoteWebDriver driver) {
        WebElement leftArrow = querySelect(driver, SIDE_PANEL_LEFT_ARROW_SELECTOR);
        if (leftArrow != null && leftArrow.isDisplayed()) {
            leftArrow.click();
            manualSleep(1000);
        }

        WebElement generalTab = querySelect(driver, "#generalInfo");
        assertThat(generalTab).isNotNull();
        generalTab.click(); // NOSONAR
    }

    static void openContextMenu(RemoteWebDriver driver, String rowId) {
        try {
            querySelect(driver, "e-context-menu#" + rowId).click();// NOSONAR
        } catch (Exception e) {
            LOGGER.error("An error occurred during opening context menu: ", e);
            takeScreenshot(driver, "openContextMenu-" + rowId);
            manualSleep(3000); // chrome frequently fails due to click interception by another element suggesting the page has not rendered
            // correctly yet even though elements available
            querySelect(driver, "e-context-menu#" + rowId).click();// NOSONAR
        }
    }

    static void verifyContextMenu(RemoteWebDriver driver, String contextMenuSelector) {
        WebElement contextMenu = querySelect(driver, contextMenuSelector);
        assertThat(contextMenu).isNotNull();
        contextMenu.click(); // NOSONAR
        verifyContextMenuOptions(driver, contextMenuSelector, getContextMenuOptions(driver));
        assertThat(getContextMenuOptions(driver)).isNotEmpty();
    }

    static void closeContextMenu(RemoteWebDriver driver) {
        Optional<WebElement> currentPageHeading = Optional.ofNullable(querySelect(driver, ".current-page"));
        currentPageHeading.ifPresentOrElse(WebElement::click, () -> fail("Cannot find current page heading"));
    }

    static void clickGoToDetailsPageMenuItem(RemoteWebDriver driver, String contextMenuSelector) {
        WebElement goToDetailsPageItem = querySelect(driver, contextMenuSelector + " eui-base-v0-dropdown [value=Go-to-details-page]");
        assertThat(goToDetailsPageItem).isNotNull();
        goToDetailsPageItem.click(); // NOSONAR
    }

    static void clickContextMenuItem(RemoteWebDriver driver, WebDriverWait wait, String contextMenuSelector, String menuItem) {
        LOGGER.info("Clicking context menu");
        wait.until(item -> querySelect(driver, contextMenuSelector).isDisplayed());
        WebElement contextMenu = querySelect(driver, contextMenuSelector);
        if (contextMenu == null) {
            takeScreenshot(driver, "clickContextMenuItem_context_menu");
            fail("ContextMenu is null.");
        }
        manualSleep(2000); // chrome has some issue that you cannot wait for. some event is triggered that closes the menu. Could be after page load
        contextMenu.click(); // NOSONAR
        wait.until(item -> querySelect(driver, contextMenuSelector + " div [menu-item]").isDisplayed());
        WebElement selectedMenuItem = querySelect(driver, contextMenuSelector + " eui-base-v0-dropdown [value=" + menuItem + "]");
        if (selectedMenuItem == null) {
            takeScreenshot(driver, "clickContextMenuItem_selectedMenuItem");
            fail("SelectedMenuItem is null.");
        }
        LOGGER.info("Clicking context menu item {}", menuItem);
        selectedMenuItem.click(); // NOSONAR
    }

    private static String[] getContextMenuOptions(RemoteWebDriver driver) {
        WebElement pageName = querySelect(driver, ".eui__tile__title");
        assertThat(pageName.getText()).isNotNull(); // NOSONAR
        return new String[] { INSTANTIATE, GO_TO_DETAILS };
    }

    private static void verifyContextMenuOptions(RemoteWebDriver driver, String contextMenuSelector,
                                                 String[] contextMenu) {
        ArrayList<WebElement> contextMenuItems = querySelectAll(driver,
                                                                contextMenuSelector + " eui-base-v0-dropdown .menu-option");
        assertThat(contextMenuItems).isNotNull();
        ArrayList<String> contextMenuOptions = new ArrayList<>();
        for (WebElement contextMenuOption : contextMenuItems) {
            contextMenuOptions.add(contextMenuOption.getText());
        }
        assertThat(contextMenuOptions).contains(contextMenu);
    }

    static void additionalAttributesFilterSearch(RemoteWebDriver driver, String stringEntered,
                                                 String numberExpectedFromSearch) {
        WebElement filterField = querySelect(driver, "#filterSearchArea");
        assertThat(filterField).isNotNull();
        filterField.click(); // NOSONAR

        Actions builder = new Actions(driver);
        builder.sendKeys(stringEntered);
        builder.perform();
        assertThat(filterField.getAttribute(VALUE)).isEqualTo(stringEntered);

        WebElement filterNumber = querySelect(driver, "div[class=additionalAttributesTab]");
        assertThat(filterNumber).isNotNull();
        assertThat(filterNumber.getText()).isNotNull(); // NOSONAR
        assertThat(filterNumber.getText()).contains("Additional Attributes (" + numberExpectedFromSearch);
    }

    static void verifyTableHeaders(RemoteWebDriver driver) {
        ArrayList<WebElement> tableHeaders = querySelectAll(driver, "th");
        ArrayList<String> tableHeaderValues = new ArrayList<>();
        for (WebElement webElement : tableHeaders) {
            tableHeaderValues.add(webElement.getText());
        }
        assertThat(tableHeaderValues).contains(
                "Package name", "Type", "Software version", "Package version", "Provider", "Usage state");
    }

    static void verifyTableHeadersWithRetry(RemoteWebDriver driver) {
        try {
            verifyTableHeaders(driver);
        } catch (StaleElementReferenceException e) {
            LOGGER.info("Web element is not attached to DOM properly, trying again:: {}", e.getMessage());
            verifyTableHeaders(driver);
        }
    }

    public static void fillOutWizardValue(RemoteWebDriver driver, String selector, String keyValue) {
        LOGGER.info("Fill {} with value {}", selector, keyValue);
        if (StringUtils.isNotEmpty(keyValue)) {
            String keyName = "input[placeholder=\"" + selector + "\"]";
            WebElement inputField = (WebElement) querySelect(driver, keyName, true);
            if (inputField != null && inputField.getAttribute(VALUE) != null && !inputField.getAttribute(VALUE).isEmpty()) {
                inputField.clear();
            } else {
                LOGGER.info("Value of the text field is null or empty");
            }
            if (inputField != null && inputField.getAttribute(VALUE) != null) {
                fillTextField(driver, inputField, keyValue);
                assertThat(inputField.getAttribute(VALUE)).isEqualTo(keyValue);
            }
        } else {
            LOGGER.info("Tried to pass in a null or empty value into {}", selector);
        }
    }

    public static void clickTableRowPackagesByName(RemoteWebDriver driver, String packageName) {
        LOGGER.info("Click table row by package name {}", packageName);
        Optional<ArrayList<WebElement>> tableRows = Optional.ofNullable(querySelectAll(driver, "e-generic-table tbody "
                + "[column=appCompositeName]"));
        tableRows.ifPresentOrElse(webElements -> {
            Optional<WebElement> pkg = webElements.stream().filter(element -> element.getText().equals(packageName))
                    .findFirst();
            pkg.ifPresentOrElse(WebElement::click, () -> fail(String.format("Cannot find the package:: %s", packageName)));
        }, () -> fail("Cannot find the table rows"));
    }

    public static boolean checkAdditionalAttributes(RemoteWebDriver driver, Map<String, String> expectedResultsMap) {
        Map<String, String> actualResultsMap = getAdditionalAttributes(driver);
        return actualResultsMap.entrySet().containsAll(expectedResultsMap.entrySet());
    }

    public static Map<String, String> getAdditionalAttributes(RemoteWebDriver driver) {
        Map<String, String> actualResultsMap = new HashMap<>();

        final Optional<ArrayList<WebElement>> accordionsInSummaryPage = Optional.ofNullable(querySelectAll(driver, EXTEND_ADDITIONAL_ATTRIBUTES_SELECTOR));
        accordionsInSummaryPage.ifPresentOrElse(webElements -> {
            Optional<WebElement> first = webElements
                    .stream()
                    .filter(webElement -> webElement.getText().equals(ADDITIONAL_ATTRIBUTES))
                    .findFirst();
            first.ifPresentOrElse(WebElement::click, () -> LOGGER.error("Cannot find Additional attributes in Summary step"));

            Optional<List<WebElement>> keysList = Optional.ofNullable(querySelectAll(driver, ADDITIONAL_ATTRIBUTE_KEY_SUMMARY_STEP_SELECTOR));
            Optional<List<WebElement>> valuesList = Optional.ofNullable(querySelectAll(driver, ADDITIONAL_ATTRIBUTE_VALUE_SUMMARY_STEP_SELECTOR));
            keysList.ifPresentOrElse(webElementsKeys -> valuesList.ifPresentOrElse(webElementsValues -> {
                for (int i = 0; i < webElementsKeys.size(); i++) {
                    actualResultsMap.put(webElementsKeys.get(i).getText(), webElementsValues.get(i).getText());
                }
            }, () -> fail("Cannot find values list")), () -> fail("Cannot find keys list"));
            first.ifPresentOrElse(WebElement::click, () -> LOGGER.error("Cannot find the extended field"));
        } , () -> fail("Cannot find accordion elements in Summary step"));

        return actualResultsMap;
    }

    public static Map<String, String> getDeployableModulesFromSummaryStep(RemoteWebDriver driver) {
        Map<String, String> actualResultsMap = new HashMap<>();
        final Optional<ArrayList<WebElement>> accordionsInSummaryPage = Optional.ofNullable(querySelectAll(driver, EXTEND_ADDITIONAL_ATTRIBUTES_SELECTOR));
        accordionsInSummaryPage.ifPresentOrElse(webElements -> {
            Optional<WebElement> first = webElements
                    .stream()
                    .filter(webElement -> webElement.getText().equals(DEPLOYABLE_MODULES))
                    .findFirst();
            first.ifPresentOrElse(WebElement::click, () -> LOGGER.error("Cannot find Deployable modules in Summary step"));

            Optional<List<WebElement>> keysList = Optional.ofNullable(querySelectAll(driver, ADDITIONAL_ATTRIBUTE_KEY_SUMMARY_STEP_SELECTOR));
            Optional<List<WebElement>> valuesList = Optional.ofNullable(querySelectAll(driver, ADDITIONAL_ATTRIBUTE_VALUE_SUMMARY_STEP_SELECTOR));
            keysList.ifPresentOrElse(webElementsKeys -> valuesList.ifPresentOrElse(webElementsValues -> {
                for (int i = 0; i < webElementsKeys.size(); i++) {
                    actualResultsMap.put(webElementsKeys.get(i).getText(), webElementsValues.get(i).getText());
                }
            }, () -> fail("Cannot find values list")), () -> fail("Cannot find keys list"));
            first.ifPresentOrElse(WebElement::click, () -> LOGGER.error("Cannot find the extended field"));
        } , () -> fail("Cannot find accordion elements in Summary step"));

        return actualResultsMap;
    }

    public static Map<String, String> getExpectedDeployableModules() {
        final HashMap<String, String> expectedDeployableModule = new HashMap<>();
        expectedDeployableModule.put(FIRST_DEPLOYABLE_MODULE_KEY, DEPLOYABLE_MODULE_DISABLED);
        expectedDeployableModule.put(SECOND_DEPLOYABLE_MODULE_KEY, DEPLOYABLE_MODULE_DISABLED);
        return expectedDeployableModule;
    }

    public static void clickDisableRadioButtonsForAllDeployableModules(RemoteWebDriver driver) {
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, FIRST_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR,
                                                       FIRST_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.clickRadioButton(driver, FIRST_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, FIRST_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR,
                                                       FIRST_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR);

        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, SECOND_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR,
                                                       SECOND_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.clickRadioButton(driver, SECOND_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, SECOND_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR,
                                                       SECOND_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR);

        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR,
                                                       THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.clickRadioButton(driver, THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR,
                                                       THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR);
    }

    public static void clickEnableRadioButtonForThirdDeployableModule(RemoteWebDriver driver) {
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR,
                                                       THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.clickRadioButton(driver, THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR);
        CommonSteps.verifyRadioButtonsOnlyFirstChecked(driver, THIRD_DEPLOYABLE_MODULE_ENABLED_RADIO_BUTTON_LOCATOR,
                                                       THIRD_DEPLOYABLE_MODULE_DISABLED_RADIO_BUTTON_LOCATOR);
    }

    public static void fillOutWizardValueTextArea(RemoteWebDriver driver, String keyName, String keyValue) {
        LOGGER.info("Fill {} with value {}", keyName, keyValue);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        if (StringUtils.isNotEmpty(keyValue)) {
            wait.until(item -> querySelect(driver, keyName).isEnabled());
            WebElement inputField = (WebElement) querySelect(driver, keyName, true);
            if (inputField != null && inputField.getAttribute(VALUE) != null) {
                if (!inputField.getAttribute(VALUE).isEmpty()) {
                    inputField.clear();
                }
                fillTextField(driver, inputField, keyValue);
                assertThat(inputField.getAttribute(VALUE)).isEqualTo(keyValue);
            } else {
                LOGGER.info("Value of the text field wasn't found or is null or empty");
            }
        } else {
            LOGGER.info("Tried to pass in a null or empty value into {}", keyName);
        }
    }

    public static void clearWizardValueField(RemoteWebDriver driver, String keyName) {
        LOGGER.info("Clear {} field", keyName);
        WebElement inputField = (WebElement) querySelect(driver, keyName, true);
        if (inputField != null) {
            inputField.clear();
        } else {
            LOGGER.info("There is no such field");
        }
    }

    public static Map<String, String> getAdditionalAttributesValuesFromAdditionalAttributesStep(RemoteWebDriver driver) {//only for text fields and
        // text area, for other types need to be updated
        Map<String, String> additionalAttributes = new HashMap<>();
        Optional<List<WebElement>> listOfAttributes = Optional.ofNullable(querySelectAll(driver,
                                                                                         ADDITIONAL_ATTRIBUTE_TEXT_FIELD_ADDITIONAL_ATTRIBUTES_STEP_SELECTOR));
        listOfAttributes.ifPresentOrElse(webElements -> webElements.forEach(el -> {
                String attributeName = el.getAttribute("name");
                String attributeValue = el.getAttribute(VALUE_ATTR);
                if (!attributeValue.isEmpty()) {
                    additionalAttributes.put(attributeName, attributeValue);
                }
        }), () -> fail("Cannot find additional attributes field"));
        return additionalAttributes;
    }

    public static void checkFillingComplexAddAttributeWithInvalidValues(RemoteWebDriver driver, String attributeSelector, String valueToFill,
                                                                        WebElement button, String error, boolean isAdditionalAttribute) {
        if (valueToFill.isEmpty()) {
            LOGGER.info("Delete value from {} type field - check that {} appears and [next] button is disabled.", attributeSelector, error);
            clearWizardValueField(driver, attributeSelector);
        } else {
            LOGGER.info("Set invalid value {} into {} type field - check that error appears and [next] button is disabled.",
                        valueToFill, attributeSelector);
            fillOutWizardValueTextArea(driver, attributeSelector, valueToFill);
        }
        if (isAdditionalAttribute) {
            assertThat((querySelect(driver, ADDITIONAL_ATTRIBUTES_SELECTOR)).getText()).contains(error); // NOSONAR
        }
        assertThat(button.getAttribute(DISABLED)).isEqualTo("true");
    }

    public static void checkFillingComplexAddAttributeWithValidValues(RemoteWebDriver driver, String attributeSelector, String valueToFill,
                                                                      WebElement button) {
        LOGGER.info("Set valid value into {} type field", attributeSelector);
        fillOutWizardValueTextArea(driver, attributeSelector, valueToFill);
        assertThat(button.isEnabled()).isTrue();
    }

    public static void validateAdditionalAttributeFieldWithInvalidValue(RemoteWebDriver driver, String attributeSelector, String valueToFill,
                                                                        WebElement button, String error) {
        fillOutWizardValue(driver, attributeSelector, valueToFill);
        Optional<WebElement> field = Optional.ofNullable(querySelect(driver, ADDITIONAL_ATTRIBUTES_SELECTOR));
        field.ifPresentOrElse(webElement -> assertThat(webElement.getText()).contains(error),
                              () -> fail("Cannot find additional attributes field"));
        assertThat(button.getAttribute(DISABLED)).isEqualTo("true");
    }

    public static void validateAdditionalAttributeFieldWithValidValue(RemoteWebDriver driver, String attributeSelector, String valueToFill,
                                                                      WebElement button) {
        fillOutWizardValue(driver, attributeSelector, valueToFill);
        assertThat(button.isEnabled()).isTrue();
    }

    public static void selectFromDropdown(RemoteWebDriver driver, Object keyValue, final String dropdownListSelector,
                                          final String dropdownItemSelector, WebElement dropdownElement) {
        LOGGER.info("Selecting dropdown value {}", keyValue);
        dropdownElement.click();
        Optional<ArrayList<WebElement>> dropdownList = Optional.ofNullable(querySelectAll(driver, dropdownListSelector));
        printDropdownValues(dropdownList);
        Optional<WebElement> item = dropdownList
                .flatMap(webElements -> webElements.stream()
                        .filter(webElement -> webElement.getText().equalsIgnoreCase(keyValue.toString())).findFirst());
        item.ifPresentOrElse(webElement -> waitForElementWithText(driver, dropdownItemSelector, webElement.getText()).click(),
                             () -> fail(String.format("There is no value \"%s\" in the dropdown list", keyValue)));
    }

    private static void printDropdownValues(Optional<ArrayList<WebElement>> dropdownList) {
        if (dropdownList.isEmpty()) {
            fail("Dropdown optional is empty.");
        }
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Dropdown values:");
        dropdownList.get().forEach(webElement -> stringBuilder.append(" " + webElement.getText() + ";"));
        LOGGER.info(stringBuilder.toString());
    }

    public static void openBackupsTabInSidePanel(RemoteWebDriver driver) {
        WebElement detailsTabRightArrow = querySelect(driver, SIDE_PANEL_RIGHT_ARROW_SELECTOR);

        for (int i = 0; i < 3; i++) {
            manualSleep(1000);
            detailsTabRightArrow.click(); //NOSONAR
        }

        WebElement backupsTab = querySelect(driver, SIDE_PANEL_BACKUPS_TAB_SELECTOR);
        assertThat(backupsTab).isNotNull();
        manualSleep(500);
        backupsTab.click(); // NOSONAR
    }

    public static Map<String, String> checkAndRetrieveAdditionalAttributes(RemoteWebDriver driver) {
        LOGGER.info("Proceed operation with default additional attributes values - check that no error appears");
        Optional<WebElement> nextButton = Optional.ofNullable(querySelect(driver, NEXT_BUTTON));
        Map<String, String> expectedDefaultResultsMap = getAdditionalAttributesValuesFromAdditionalAttributesStep(driver);
        nextButton.ifPresentOrElse(WebElement::click, () -> fail("Cannot find the next button"));
        Optional<WebElement> extendedField = Optional.ofNullable(querySelect(driver, EXTEND_ADDITIONAL_ATTRIBUTES_SELECTOR));
        extendedField.ifPresentOrElse(WebElement::click, () -> fail("Cannot find the extended field"));
        assertThat(checkAdditionalAttributes(driver, expectedDefaultResultsMap)).isTrue();

        Optional<WebElement> previousButton = Optional.ofNullable(querySelect(driver, PREVIOUS_BUTTON));
        previousButton.ifPresentOrElse(WebElement::click, () -> fail("Cannot find the previous button"));

        LOGGER.info("Set incorrect values into list type fields");
        nextButton = Optional.ofNullable(querySelect(driver, NEXT_BUTTON));
        nextButton.ifPresentOrElse(
                webElement -> checkAttributes(driver, webElement), () -> fail("Cannot find the next button"));
        return getAdditionalAttributesValuesFromAdditionalAttributesStep(driver);
    }

    public static void checkAttributes(RemoteWebDriver driver, WebElement nextButton) {
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_LIST_VALUE, nextButton,
                                                         ENTRY_SCHEMA_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_LIST_VALUE, nextButton,
                                                         INVALID_JSON_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, "", nextButton, INVALID_JSON_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, nextButton,
                                                         NOT_LIST_TYPE_ERROR_TEXT, true);

        LOGGER.info("Set correct values into list type fields");
        checkFillingComplexAddAttributeWithValidValues(driver, LIST_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, nextButton);
        checkFillingComplexAddAttributeWithValidValues(driver, LIST_OF_LISTS_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_OF_LISTS_VALUE, nextButton);
        checkFillingComplexAddAttributeWithValidValues(driver, LIST_OF_MAPS_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_OF_MAPS_VALUE, nextButton);

        LOGGER.info("Set incorrect values into map type fields");
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INCORRECT_MAP_VALUE, nextButton,
                                                         ENTRY_SCHEMA_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, INVALID_MAP_VALUE, nextButton,
                                                         INVALID_JSON_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, "", nextButton, INVALID_JSON_ERROR_TEXT, true);
        checkFillingComplexAddAttributeWithInvalidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_LIST_VALUE, nextButton,
                                                         NOT_MAP_TYPE_ERROR_TEXT, true);

        LOGGER.info("Set correct values into map type fields");
        checkFillingComplexAddAttributeWithValidValues(driver, MAP_TYPE_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_VALUE, nextButton);
        checkFillingComplexAddAttributeWithValidValues(driver, MAP_OF_MAPS_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_OF_MAPS_VALUE, nextButton);
        checkFillingComplexAddAttributeWithValidValues(driver, MAP_OF_LISTS_ADD_ATTRIBUTE_SELECTOR, VALID_MAP_OF_LISTS_VALUE, nextButton);

        LOGGER.info("Validate values.yaml field");
        validateAdditionalAttributeFieldWithInvalidValue(driver, VALUES_YAML_SELECTOR, INVALID_VALUES_YAML, nextButton, INVALID_JSON_ERROR_TEXT);
        validateAdditionalAttributeFieldWithValidValue(driver, VALUES_YAML_SELECTOR, VALID_VALUES_YAML, nextButton);
    }

    public static void loadResources(RemoteWebDriver driver) {
        loadApplication(RESOURCES, driver);
        driver.manage().window().maximize();
        waitForElementWithText(driver, "#main-panel-title", RESOURCES);
        waitForElementWithText(driver, "div[column=vnfProductName]", "vEPG");
    }

    public static void checkContextMenuOptionNotPresentForResource(RemoteWebDriver driver, String resourceId, String selectorPrefix) {
        openContextMenu(driver, resourceId);
        WebElement option = querySelect(driver, selectorPrefix + resourceId);
        assertThat(option).isNull();
        closeContextMenu(driver);
    }

    static void typeText(final RemoteWebDriver driver, final String... characters) {
        Actions stepsToOperation = new Actions(driver);
        stepsToOperation.sendKeys(characters);
        stepsToOperation.perform();
    }

    static void validateApplicationTimeout(final RemoteWebDriver driver,
                                           final WebDriverWait wait,
                                           final WebElement operationButton) {
        LOGGER.info("Set a negative value for application timeout, verify error message");
        WebElement applicationTimeout = querySelect(driver, "eui-base-v0-text-field#applicationTimeOut");
        assertThat(applicationTimeout).isNotNull();
        applicationTimeout.click();// NOSONAR
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "-5");
        WebElement timeoutError = querySelect(driver, INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR);
        assertThat(timeoutError).isNotNull();
        LOGGER.info("Checking invalid timeout message");
        wait.until(item -> timeoutError).isDisplayed();
        assertThat(timeoutError.getAttribute("innerHTML").contains(INVALID_TIMEOUT_ERROR_MESSAGE)).isTrue();// NOSONAR
        assertThat(operationButton.getAttribute(DISABLED)).isNotNull();

        LOGGER.info("Set text for application timeout, verify error message");
        applicationTimeout.click();
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "b");
        waitForElementWithText(driver, INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR, INVALID_TIMEOUT_ERROR_MESSAGE);
        assertThat(operationButton.getAttribute(DISABLED)).isNotNull();

        LOGGER.info("Set valid value for application timeout");
        applicationTimeout.click();
        typeText(driver, Keys.BACK_SPACE.toString(), Keys.BACK_SPACE.toString(), "50");
        WebElement invalidAppTimeoutErrorMessage = querySelect(driver, INVALID_APP_TIMEOUT_ERROR_MESSAGE_SELECTOR);
        if (invalidAppTimeoutErrorMessage != null) {
            wait.until(ExpectedConditions.textToBePresentInElement(invalidAppTimeoutErrorMessage, ""));
        }
        if (operationButton.getAttribute(DISABLED) != null) {
            wait.until(ExpectedConditions.attributeToBe(operationButton, DISABLED, FALSE));
        }

        if (operationButton.getAttribute(DISABLED) != null) {
            wait.until(ExpectedConditions.attributeToBe(operationButton, DISABLED, FALSE));
        }
    }

    static void validateRestoreAttributes(final RemoteWebDriver driver,
                                          final WebDriverWait wait,
                                          final WebElement operationButton) {
        LOGGER.info("Set a value for restore backup reference, verify missing password error message");
        WebElement restorePassword = querySelect(driver, "eui-base-v0-password-field#restorePassword");
        WebElement restoreReference = querySelect(driver, "eui-base-v0-text-field#restoreBackupReference");
        assertThat(restorePassword).isNotNull();
        assertThat(restoreReference).isNotNull();
        restoreReference.click();// NOSONAR
        typeText(driver, "sftp://");
        WebElement missingPasswordError = querySelect(driver, MISSING_PASSWORD_ERROR_MESSAGE_SELECTOR);
        assertThat(missingPasswordError).isNotNull();
        LOGGER.info("Checking missing password message");
        wait.until(item -> missingPasswordError).isDisplayed();
        assertThat(missingPasswordError.getAttribute("innerHTML").contains(MISSING_PASSWORD_ERROR_MESSAGE)).isTrue();// NOSONAR
        assertThat(operationButton.getAttribute(DISABLED)).isNotNull();

        LOGGER.info("Set a value for backup password");
        restorePassword.click(); //NOSONAR
        typeText(driver, "5wrgbbsd");
        WebElement missingPasswordErrorMessage = querySelect(driver, MISSING_PASSWORD_ERROR_MESSAGE_SELECTOR);
        if (missingPasswordErrorMessage != null) {
            wait.until(ExpectedConditions.textToBePresentInElement(missingPasswordErrorMessage, ""));
        }
        if (operationButton.getAttribute(DISABLED) != null) {
            wait.until(ExpectedConditions.attributeToBe(operationButton, DISABLED, FALSE));
        }
    }

    static void validateMultiSecret(final RemoteWebDriver driver, final WebElement operationButton) throws IOException {
        LOGGER.info("Clicking Add Secret Button");
        scrollIntoView(driver, MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR);
        clickOnTheButton(driver, MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR);

        LOGGER.info("Verify add and delete of secret card");
        verifyAddAndDeleteForMultiSecret(driver, MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR, MULTI_SECRET_DELETE_CARD_BUTTON_SELECTOR,
                                         MULTI_SECRET_CARDS_SELECTOR);

        LOGGER.info("Verifying duplicate Secret Name in cards");
        clickOnTheButton(driver, MULTI_SECRET_ADD_CARD_BUTTON_SELECTOR);
        verifyDuplicateFieldsForMultiSecret(driver, MULTI_SECRET_SECRET_NAME_TEXTFIELD, MULTI_SECRET_SECRET_NAME_ERROR_SELECTOR,
                                            DUPLICATE_SECRET_NAME_ERROR, 2);
        WebElement deleteCardButton = querySelect(driver, MULTI_SECRET_DELETE_CARD_BUTTON_SELECTOR);
        scrollIntoView(driver, deleteCardButton);
        clickOnTheButton(driver, MULTI_SECRET_DELETE_CARD_BUTTON_SELECTOR);

        LOGGER.info("Verify add and delete of key value pair");
        verifyAddAndDeleteForMultiSecret(driver, MULTI_SECRET_CARD_ADD_KV_PAIR_BUTTON_SELECTOR, MULTI_SECRET_DELETE_KEY_VALUE_PAIR,
                                         MULTI_SECRET_KV_PAIR_SELECTOR);

        LOGGER.info("Entering Secret Name to remaining Multi Secret Card");
        fillTextField(driver, MULTI_SECRET_SECRET_NAME_TEXTFIELD, "SecretName1");

        LOGGER.info("Error message for missing key/value pair should appear");
        waitForElementWithText(driver, MULTI_SECRET_KEY_FIELD_ERROR_SELECTOR, EMPTY_KEY_AND_VALUE_TEXTFIELD);

        LOGGER.info("Ensuring warning icon appears indicating one or more invalid inputs");
        WebElement warningIcon = querySelect(driver, MULTI_SECRET_CARD_WARNING_SELECTOR);
        assertThat(warningIcon).isNotNull();

        LOGGER.info("Verify duplicates keys for key value pairs");
        clickOnTheButton(driver, MULTI_SECRET_CARD_ADD_KV_PAIR_BUTTON_SELECTOR);
        verifyDuplicateFieldsForMultiSecret(driver, MULTI_SECRET_KEY_TEXTFIELD, MULTI_SECRET_KEY_FIELD_ERROR_SELECTOR,
                                            DUPLICATE_KEY_ERROR, 2);
        clickOnTheButton(driver, MULTI_SECRET_DELETE_KEY_VALUE_PAIR);
        checkButtonIsDisabled(driver, MULTI_SECRET_DELETE_KEY_VALUE_PAIR);

        LOGGER.info("Checking if the empty value warning appears when only the key field is entered");
        fillTextField(driver, MULTI_SECRET_KEY_TEXTFIELD, "key1");
        waitForElementWithText(driver, MULTI_SECRET_VALUE_FIELD_ERROR_SELECTOR, EMPTY_VALUE_WARNING);
        clearTextField(driver, MULTI_SECRET_KEY_TEXTFIELD);

        LOGGER.info("Checking if the empty key warning appears when only the value field is entered");
        checkButtonIsEnabled(driver, MULTI_SECRET_FILE_UPLOAD_SELECTOR);
        fillTextField(driver, MULTI_SECRET_VALUE_TEXTFIELD, "value1");
        checkButtonIsDisabled(driver, MULTI_SECRET_FILE_UPLOAD_SELECTOR);
        waitForElementWithText(driver, MULTI_SECRET_KEY_FIELD_ERROR_SELECTOR, EMPTY_KEY_WARNING);
        clearTextField(driver, MULTI_SECRET_VALUE_TEXTFIELD);

        LOGGER.info("Verify attach a file for the value of key value pairs");
        verifyAttachJSONFileForMultiSecret(driver);

        LOGGER.info("Entering valid key and value into remaining key/value pair");
        fillTextField(driver, MULTI_SECRET_KEY_TEXTFIELD, "key2");
        fillTextField(driver, MULTI_SECRET_VALUE_TEXTFIELD, "value2");

        LOGGER.info("Ensuring warning icon disappear and heal button enabled");
        warningIcon = querySelect(driver, MULTI_SECRET_CARD_WARNING_SELECTOR);
        assertThat(warningIcon).isNull();
        assertThat(operationButton.getAttribute(DISABLED)).isNull();

        LOGGER.info("Value field should be encrypted");
        WebElement valueState = querySelect(driver, MULTI_SECRET_VALUE_TEXTFIELD_STATE);
        assertThat(valueState).isNotNull();
        LOGGER.info(valueState.getAttribute("type")); // NOSONAR
        assertThat(valueState.getAttribute("type").contains("password")).isTrue();
        WebElement hiddenEye = querySelect(driver, MULTI_SECRET_HIDDEN_EYE);
        assertThat(hiddenEye).isNotNull();
        hiddenEye.click(); // NOSONAR
        LOGGER.info(valueState.getAttribute("type"));
        assertThat(valueState.getAttribute("type").contains("text")).isTrue();

        LOGGER.info("Collapsing Card");
        clickOnTheButton(driver, MULTI_SECRET_CHEVRON);
        LOGGER.info("If card collapsed properly then subtitle should be populated");
        WebElement secretNameSubTitle = querySelect(driver, MULTI_SECRET_SUBTITLE);
        assertThat(secretNameSubTitle).isNotNull();
    }

    static void verifyDuplicateFieldsForMultiSecret(final RemoteWebDriver driver, String fieldSelector, String errorFieldSelector,
                                                    String errorMessage, int numOfFields) {
        LOGGER.info("Fill with duplicate values");
        List<WebElement> fields = querySelectAll(driver, fieldSelector);
        assertThat(fields).isNotNull();
        assertEquals(numOfFields, fields.size()); // NOSONAR
        fields.forEach(field -> fillTextField(driver, field, "duplicateKey"));

        LOGGER.info("Verify error shows correctly if duplicate exists");
        List<WebElement> errorFields = querySelectAll(driver, errorFieldSelector);
        assertThat(fields).isNotNull();
        assertEquals(numOfFields, errorFields.size()); // NOSONAR
        assertThat(errorFields.stream().allMatch(errorField -> errorField.getText().equals(errorMessage))).isTrue();

        LOGGER.info("Remove duplicate values and verify error disappear");
        clearTextField(driver, fields.get(0));
        fillTextField(driver, fields.get(0), "nonDuplicateKey");
        assertThat(errorFields.stream().noneMatch(WebElement::isDisplayed)).isTrue();
        fields.forEach(field -> clearTextField(driver, field));
    }

    static void verifyAddAndDeleteForMultiSecret(final RemoteWebDriver driver, String addButtonSelector,
                                                 String deleteButtonSelector, String addedElementSelector) {
        WebElement addButton = querySelect(driver, addButtonSelector);
        scrollIntoView(driver, addButton);
        driver.executeScript("arguments[0].click()", addButton);
        List<WebElement> addedElements = querySelectAll(driver, addedElementSelector);
        assertThat(addedElements).isNotNull();
        assertEquals(2, addedElements.size()); // NOSONAR
        WebElement deleteButton = querySelect(driver, deleteButtonSelector);
        scrollIntoView(driver, deleteButton);
        deleteButton.click(); // NOSONAR
        addedElements = querySelectAll(driver, addedElementSelector);
        assertThat(addedElements).isNotNull();
        assertEquals(1, addedElements.size()); // NOSONAR
    }

    static void verifyAttachJSONFileForMultiSecret(final RemoteWebDriver driver) throws IOException {
        fillTextField(driver, MULTI_SECRET_KEY_TEXTFIELD, "key1");

        LOGGER.info("Verify after provide valid input with invalid .json format.");
        WebElement valueTextField = querySelect(driver, MULTI_SECRET_VALUE_TEXTFIELD);
        assertThat(valueTextField).isNotNull();
        File tempFileInvalidJSON = uploadTempFileWithExtension(driver, MULTI_SECRET_FILE_UPLOAD_SELECTOR, ".json", "{\"key1\":}");
        waitForElementWithText(driver, MULTI_SECRET_VALUE_FIELD_ERROR_SELECTOR, INVALID_JSON_FORMAT);
        assertThat(valueTextField.getAttribute(VALUE_ATTR).contains(tempFileInvalidJSON.getName())).isTrue(); // NOSONAR

        LOGGER.info("Verify after provide valid input with correct file extension and valid json format.");
        File tempFile = uploadTempFileWithExtension(driver, MULTI_SECRET_FILE_UPLOAD_SELECTOR, ".json", "{\"key1\":\"value1\"}");
        assertThat(valueTextField.getAttribute(VALUE_ATTR).contains(tempFile.getName())).isTrue();

        LOGGER.info("Verify clear of attached file in value text field");
        clickOnTheButton(driver, MULTI_SECRET_VALUE_TEXTFIELD_CLEAR);
        assertThat(valueTextField.getAttribute(VALUE_ATTR).isEmpty()).isTrue();
        waitForElementWithText(driver, MULTI_SECRET_VALUE_FIELD_ERROR_SELECTOR, EMPTY_VALUE_WARNING);
    }

    static void validateSecretAttributes(final RemoteWebDriver driver) {
        LOGGER.info("Check secret attributes and set a values");

        LOGGER.info("Check restore.scope");
        String restoreScopeSelector = "eui-base-v0-text-field[name=\"restore.scope\"]";
        WebElement restoreScope = querySelect(driver, restoreScopeSelector);
        assertThat(restoreScope).isNotNull();
        clearTextField(driver, restoreScopeSelector);
        scrollIntoView(driver, restoreScope);
        restoreScope.click();// NOSONAR
        typeText(driver, "restoreScope");

        LOGGER.info("Check restore.backupName");
        WebElement restoreBackupName = querySelect(driver, "eui-base-v0-text-field[name=\"restore.backupName\"]");
        assertThat(restoreBackupName).isNotNull();
        scrollIntoView(driver, restoreBackupName);
        restoreBackupName.click();// NOSONAR
        typeText(driver, "restoreBackupName");

        LOGGER.info("Check secretname");
        WebElement secretName = querySelect(driver, "eui-base-v0-text-field[name=\"day0.configuration.secretname\"]");
        scrollIntoView(driver, secretName);
        assertThat(secretName).isNotNull();

        LOGGER.info("Check param1.key");
        WebElement param1Key = querySelect(driver, "eui-base-v0-text-field[name=\"day0.configuration.param1.key\"]");
        assertThat(param1Key).isNotNull();

        LOGGER.info("Check and set param1.value");
        WebElement param1Value = querySelect(driver, "eui-base-v0-password-field[name=\"day0.configuration.param1.value\"]");
        assertThat(param1Value).isNotNull();
        param1Value.click();// NOSONAR
        scrollIntoView(driver, param1Value);
        typeText(driver, "param1Value");

        LOGGER.info("Check param2.key");
        WebElement param2Key = querySelect(driver, "eui-base-v0-text-field[name=\"day0.configuration.param2.key\"]");
        assertThat(param2Key).isNotNull();

        LOGGER.info("Check and set param2.value");
        WebElement param2Value = querySelect(driver, "eui-base-v0-password-field[name=\"day0.configuration.param2.value\"]");
        assertThat(param2Value).isNotNull();
        scrollIntoView(driver, param2Value);
        param2Value.click();// NOSONAR
        typeText(driver, "param2Value");
    }

    public static void confirmHeal(final RemoteWebDriver driver,
                                   final WebDriverWait wait,
                                   final WebElement healButton) {
        LOGGER.info("Click the heal button");
        healButton.click();// NOSONAR
        WebElement confirmHeal = querySelect(driver, "#heal-confirmation");

        LOGGER.info("Confirm heal");
        wait.until(ExpectedConditions.elementToBeClickable(confirmHeal));
        confirmHeal.click();// NOSONAR
    }

    public static void clickOnTheButton(RemoteWebDriver driver, String buttonSelector) {
        LOGGER.info("Find the button by selector {} and click on it", buttonSelector);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10L));
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(querySelect(driver, buttonSelector)));
        button.click();
        LOGGER.info("Button by selector {} clicked", buttonSelector);
    }

    public static void clickDialogButton(RemoteWebDriver driver, String buttonText) {
        LOGGER.info("Click on dialog button {}", buttonText);
        WebElement button = waitForElementWithText(driver, "eui-base-v0-button", buttonText, 10000, 1000);
        button.click();
    }

    public static void checkButtonIsDisabled(RemoteWebDriver driver, String buttonSelector) {
        WebElement button = querySelect(driver, buttonSelector);
        assertThat(button).isNotNull();
        assertThat(button.getAttribute(DISABLED)).isEqualTo("true");// NOSONAR
    }

    public static void checkButtonIsEnabled(RemoteWebDriver driver, String buttonSelector) {
        WebElement button = querySelect(driver, buttonSelector);
        assertThat(button).isNotNull();
        assertThat(button.isEnabled()).isTrue();// NOSONAR
    }

    public static void fillTextField(RemoteWebDriver driver, String textFieldSelector, String value) {
        getTextField(driver, textFieldSelector);
        Actions builder = new Actions(driver);
        builder.sendKeys(value).perform();
    }

    public static void clearTextField(RemoteWebDriver driver, String textFieldSelector) {
        getTextField(driver, textFieldSelector);
        Actions builder = new Actions(driver);
        builder.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.BACK_SPACE).build().perform();
    }

    public static void getTextField(RemoteWebDriver driver, String textFieldSelector) {
        WebElement textField = querySelect(driver, textFieldSelector);
        assertThat(textField).isNotNull();
        textField.click();// NOSONAR
    }

    public static void checkSelectedDropdownValue(RemoteWebDriver driver, String dropdownFieldSelector, String keyValue) {
        LOGGER.info("Check that correct value {} was selected in the dropdown field", keyValue);
        WebElement dropdownField = querySelect(driver, dropdownFieldSelector);
        assertThat(dropdownField).isNotNull();
        assertThat(dropdownField.getAttribute("label")).isEqualTo(keyValue);// NOSONAR
    }

    public static void clickFullTableRow(String tableId, String row, RemoteWebDriver driver) {
        Optional<WebElement> tableRow = Optional.ofNullable(querySelect(driver, "e-generic-table#" + tableId + TABLE_ROW_SELECTOR + row + ") td:nth"
                + "-child(2)"));
        tableRow.ifPresentOrElse(WebElement::click, () -> fail(String.format("Cannot find the table row:: %s", tableRow)));
    }

    public static void checkButtonName(RemoteWebDriver driver, String buttonSelector, String buttonName) {
        Optional<WebElement> button = Optional.ofNullable(querySelect(driver, buttonSelector));
        if (button.isPresent()) {
            assertThat(button.get().getAttribute("innerText").equals(buttonName)).isTrue();
        } else {
            LOGGER.info("No button can be found by the selector {}", buttonSelector);
        }
    }

    public static String getFilePath(String configFileName) {
        LOGGER.info("Get absolute path to the cluster config file");
        ClassLoader classLoader = CommonSteps.class.getClassLoader();
        File file = new File(Objects.requireNonNull(classLoader.getResource(configFileName)).getFile());
        return file.getAbsolutePath();
    }

    public static void fillTextField(RemoteWebDriver driver, WebElement inputField, String values) {
        driver.executeScript("arguments[0].scrollIntoView();", inputField);
        inputField.click();
        Actions builder = new Actions(driver);
        builder.sendKeys(values);
        builder.perform();
    }

    public static void clearTextField(RemoteWebDriver driver, WebElement inputField) {
        driver.executeScript("arguments[0].scrollIntoView();", inputField);
        inputField.click();
        Actions builder = new Actions(driver);
        builder.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.BACK_SPACE).build().perform();
    }

    public static Map<String, String> getGenericKeyValueMap(final RemoteWebDriver driver, final String keyValueListSelector) {
        Optional<ArrayList<WebElement>> webElementsMap = Optional.ofNullable(querySelectAll(driver, keyValueListSelector + " .key-value-list-item"));
        Map<String, String> genericKeyValueListAsMap = new HashMap<>();
        if (webElementsMap.isPresent()) {
            genericKeyValueListAsMap = webElementsMap.get()
                    .stream()
                    .collect(Collectors.toMap(key -> key.findElement(By.className("key-value-list-key")).getText(),
                                              value -> value.findElement(By.className("key-value-list-value")).getText()));
        }
        return genericKeyValueListAsMap;
    }

    public static void checkSubtitle(final RemoteWebDriver driver, String subtitle) {
        Optional<WebElement> clusterSubtitle = Optional.ofNullable(querySelect(driver, "eui-layout-v0-multi-panel-tile"));
        clusterSubtitle.ifPresentOrElse(webElement -> assertThat(webElement.getAttribute("subtitle")).isEqualTo(subtitle),
                                        () -> fail("Cannot find subtitle attributes field"));
    }

    public static void clickPaginatedPageElement(RemoteWebDriver driver, String paginationElementSelector, String findByDataValue) {
        Optional<ArrayList<WebElement>> paginationPageList = Optional.ofNullable(querySelectAll(driver, paginationElementSelector + " ul li"));
        paginationPageList.ifPresentOrElse(pageList -> {
            Optional<WebElement> pageElement =
                    pageList.stream().filter(page -> page.getAttribute("data-value").equalsIgnoreCase(findByDataValue)).findFirst();
            pageElement.ifPresentOrElse(WebElement::click, () -> fail(String.format("Cannot find the pagination element :: %s", findByDataValue)));
        }, () -> fail("Cannot find the table rows"));
    }

    /**
     * Verify the rows of table can be selected and de-selected.
     *
     * @param driver          Webdriver.
     * @param tableIDSelector The table selector.
     */
    public static void verifyTableRowsSelectedAndDeselected(RemoteWebDriver driver, String tableIDSelector) {
        LOGGER.info("Verify that resources can be selected and deselected");
        clickFullTableRow(tableIDSelector, "1", driver);
        assertThat(checkRowSelected("1", false, driver)).isTrue();
        clickFullTableRow(tableIDSelector, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isTrue();
        assertThat(checkRowSelected("1", false, driver)).isFalse();
        clickFullTableRow(tableIDSelector, "2", driver);
        assertThat(checkRowSelected("2", false, driver)).isFalse();
    }

    /**
     * Verify a view is paginated, check pagination attributes are present, check subtitle
     *
     * @param driver        Webdriver.
     * @param currentPage   The current page.
     * @param lastPage      The last page of results.
     * @param pageSize      The amount results per page.
     * @param totalElements The total number of elements in the query result.
     */
    public static void verifyViewIsPaginated(RemoteWebDriver driver, String currentPage, String lastPage, int pageSize, int totalElements) {
        Optional<WebElement> paginationTable = Optional.ofNullable(querySelect(driver, PAGINATION_SELECTOR));
        paginationTable.ifPresentOrElse(paginationElement -> {
            assertThat(paginationElement.getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo(currentPage);
            assertThat(paginationElement.getAttribute(PAGINATION_NUM_PAGES)).isEqualTo(lastPage);
        }, () -> fail("Cannot find the pagination element"));
        checkSubtitle(driver, String.format("(1 - %d of %d)", pageSize, totalElements));
    }

    /**
     * Verify a table is paginated.
     *
     * @param driver                   Webdriver.
     * @param currentPage              The current page.
     * @param lastPage                 The last page of the results.
     * @param numberElementsInLastPage The number of results in the last page.
     * @param totalElements            The total number of elements in the query result.
     * @param tableSelector            The table selector.
     */
    public static void verifyTableIsPaginated(final RemoteWebDriver driver,
                                              String currentPage,
                                              String lastPage,
                                              int numberElementsInLastPage,
                                              int totalElements,
                                              String tableSelector) {

        clickPaginatedPageElement(driver, PAGINATION_SELECTOR, lastPage);
        manualSleep(2000);
        final Optional<List<WebElement>> tableRows = Optional.ofNullable(querySelectAll(driver, tableSelector));
        tableRows.ifPresentOrElse(tableRowsElement -> assertThat(tableRowsElement.size()).isEqualTo(numberElementsInLastPage),
                                  () -> fail("Cannot find the table rows element"));
        Optional<WebElement> paginationTable = Optional.ofNullable(querySelect(driver, PAGINATION_SELECTOR));
        if (paginationTable.isPresent()) {
            assertThat(paginationTable.get().getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo(lastPage);
            checkSubtitle(driver, String.format("(%d - %d of %d)", totalElements - numberElementsInLastPage + 1, totalElements, totalElements));
            clickPaginatedPageElement(driver, PAGINATION_SELECTOR, currentPage);
            assertThat(paginationTable.get().getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo(currentPage);
        } else {
            fail("Cannot find the pagination table element");
        }
    }

    public static void clickPaginationArrow(final RemoteWebDriver driver, String expectedPage, String arrowSelector) {
        clickOnTheButton(driver, arrowSelector);
        manualSleep(1000);
        Optional<WebElement> paginationTable = Optional.ofNullable(querySelect(driver, PAGINATION_SELECTOR));
        paginationTable.ifPresentOrElse(paginationTableElement -> assertThat(paginationTableElement.getAttribute(PAGINATION_CURRENT_PAGE)).isEqualTo(
                                                expectedPage),
                                        () -> fail("Cannot find the pagination table"));
    }

    public static File uploadTempFileWithExtension(final RemoteWebDriver driver, String uploaderSelector, String extension) throws IOException {
        return uploadTempFileWithExtension(driver, uploaderSelector, extension, "");
    }

    public static File uploadTempFileWithExtension(final RemoteWebDriver driver, String uploaderSelector, String extension, String content)
    throws IOException {
        LOGGER.info("Create a temp file and select it for uploader.");
        if (driver.getClass() == RemoteWebDriver.class) {
            driver.setFileDetector(new LocalFileDetector());
        }
        File tempFile = File.createTempFile("temp", extension); // NOSONAR
        Files.write(tempFile.toPath(), content.getBytes(StandardCharsets.UTF_8));
        tempFile.deleteOnExit();
        WebElement uploader = querySelect(driver, uploaderSelector);
        if (uploader != null) {
            uploader.sendKeys(tempFile.getAbsolutePath());
        } else {
            fail("Could not find file uploader element.");
        }
        return tempFile;
    }

    public static void verifyElementAttributeEqualTo(RemoteWebDriver driver, String elementSelector, String attributeName, String expectedValue) {
        WebElement onboardTextfield = querySelect(driver, elementSelector);
        assertThat(onboardTextfield).isNotNull();
        assertEquals(onboardTextfield.getAttribute(attributeName), expectedValue); // NOSONAR
    }

    public static void verifyRadioButtonsOnlyFirstChecked(RemoteWebDriver driver, String selectorWithCheckedElement,
                                                          String selectorWithoutCheckedElement) {
        WebElement checkedRadioButton = querySelect(driver, selectorWithCheckedElement);
        assertThat(checkedRadioButton).isNotNull();
        assertThat(checkedRadioButton.getAttribute(CHECKED)).isEqualTo("true"); // NOSONAR

        WebElement notCheckedRadioButton = querySelect(driver, selectorWithoutCheckedElement);
        assertThat(notCheckedRadioButton).isNotNull();
        assertThat(notCheckedRadioButton.getAttribute(CHECKED)).isNull(); // NOSONAR
    }

    static void clickRadioButton(RemoteWebDriver driver,
                                 String extensionRadioButton) {
        WebElement radioButton = querySelect(driver, extensionRadioButton);
        assertThat(radioButton).isNotNull();
        radioButton.click(); // NOSONAR
    }

    public static void scrollIntoView(RemoteWebDriver driver, WebElement element) {
        driver.executeScript("arguments[0].scrollIntoView(true);", element);
    }

    public static void scrollIntoView(RemoteWebDriver driver, String selector) {
        WebElement element = querySelect(driver, selector);
        driver.executeScript("arguments[0].scrollIntoView(true);", element);
    }

    public static void clearInputField(RemoteWebDriver driver, String textFieldSelector) {
        WebElement textField = querySelect(driver, textFieldSelector);
        assertThat(textField).isNotNull();
        textField.click(); // NOSONAR
        Actions builder = new Actions(driver);
        builder.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).sendKeys(Keys.BACK_SPACE).build().perform();
    }
    public static Map<String, String> getScaleLevels(RemoteWebDriver driver) {
        Map<String, String> scaleLevels = new HashMap<>();
        Optional<List<WebElement>> tableRows = Optional.ofNullable(querySelectAll(driver, ".divTableRow"));
        tableRows.ifPresentOrElse(webElements -> webElements.forEach(el -> {
            final String firstChild = ":first-child";
            final String lastChild = ":last-child";
            final String scaleLevel = "Scale Level";
            final String key = el.findElement(By.cssSelector(firstChild)).getText();
            if (key.contains(scaleLevel)) {
                String value = el.findElement(By.cssSelector(lastChild)).getText();
                scaleLevels.put(key, value);
            }
        }), () -> fail("Cannot find scale levels"));
        return scaleLevels;
    }
}
