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

import static com.ericsson.orchestration.mgmt.wfs.ui.testware.api.idam.KeycloakHelper.createUser;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.Constants.ERICSSON123;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.LoginSteps.login;
import static com.ericsson.orchestration.mgmt.wfs.ui.testware.tests.LoginSteps.logoutWithRetry;

import java.time.Duration;
import java.util.ArrayList;

import org.keycloak.representations.idm.UserRepresentation;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.utility.DockerImageName;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Listeners;

import com.ericsson.orchestration.mgmt.wfs.ui.testware.selenium.RemoteWebDriverCreator;

@Listeners(com.ericsson.orchestration.mgmt.wfs.ui.testware.configuration.TestListener.class)
public class UITest extends AbstractTestNGSpringContextTests {

    private static final Logger LOGGER = LoggerFactory.getLogger(UITest.class); //NOSONAR
    private static BrowserWebDriverContainer firefox68Rule;
    private static ChromeOptions chromeOptions;
    private static BrowserWebDriverContainer chrome76Rule;
    private static BrowserWebDriverContainer[] uninitialisedContainers;

    public static final UserRepresentation READ_ONLY_USER = getReadOnlyUser();
    public static final UserRepresentation STANDARD_USER = getStandardUser();
    public static final UserRepresentation SUPER_USER = getSuperUser();
    public static final UserRepresentation UI_USER = getUIUser();
    public static final String EVNFM_UI_USER_ROLE = "E-VNFM UI User Role";

    private static ArrayList<BrowserWebDriverContainer> containers = new ArrayList<>();
    private static ArrayList<RemoteWebDriver> drivers = new ArrayList<>();

    static {
        createUserIfRequired();
    }

    private static boolean useBrowser(String browser) {
        return System.getProperty("allBrowsers") != null || System.getProperty(browser) != null;
    }

    /**
     * To point towards your running application pass in -Dcontainer.host=<URL>
     * <p>
     * To run tests against all configured browsers pass in -DallBrowsers into test execution
     * If no browser is specified via -D param then the default will be used, firefox-65
     * To run individual browsers pass in one or more of the supported -D params currently:
     * -DallBrowsers
     * -Dfirefox-local
     * -Dchrome-local
     * <p>
     * -Dfirefox-65
     * -Dfirefox-64
     * -Dfirefox-63
     * <p>
     * -Dchrome-72
     * -Dchrome-71
     * -Dchrome-70
     * <p>
     * EXAMPLE USE CASES
     * local app local browser
     * -Dfirefox-local -Dcontainer.host=<a href="http://127.0.0.1:8080">...</a>
     * -Dchrome-local -Dcontainer.host=<a href="http://127.0.0.1:8080">...</a>
     * local app testcontainer browser
     * -Dfirefox-65 -DexposeHostPort=8080 -Dcontainer.host=<a href="http://host.testcontainers.internal:8080">...</a>
     * remote app local browser
     * -Dfirefox-local -Dcontainer.host=http://<available_url>
     * remote app testcontainer browser
     * -Dfirefox-65 -Dcontainer.host=http://<available_url>
     * <p>
     * In order to run with a local firefox/Chrome, Gecko/Chrome driver needs to be installed and added to your PATH variable
     * The version of the gecko/Chrome driver is determined by your firefox/Chrome version that is installed
     * The version that needs to be downloaded and the respective download location can be found on these sites:
     * <a href="https://github.com/SeleniumHQ/docker-selenium/releases">...</a>
     * <a href="https://github.com/mozilla/geckodriver/releases">...</a>
     * <a href="http://chromedriver.chromium.org/downloads">...</a>
     */
    @BeforeSuite
    public static void initContainers() {
        // 10101 is the port that the WFS Mock stub is running on
        // exportHostPort is for local testing and should be the port that your locally deployed application is running on
        setupWebDriverContainers();
        setFirefoxAndChromeLocal();
        setUpDrivers();
        loginToAllDrivers();
    }

    private static void setupWebDriverContainers() {
        firefox68Rule =
                new BrowserWebDriverContainer(DockerImageName //NOSONAR
                .parse("armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/selenium/standalone-firefox:4.1.4")
                .asCompatibleSubstituteFor("selenium/standalone-firefox"))
                .withCapabilities(
                    new FirefoxOptions());
        chromeOptions = new ChromeOptions().addArguments("--ignore-ssl-errors=yes")
                .addArguments("--ignore-certificate-errors")
                .addArguments("--allow-insecure-localhost");
        chromeOptions.setAcceptInsecureCerts(true);
        chrome76Rule = new BrowserWebDriverContainer(DockerImageName //NOSONAR
                .parse("armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/selenium/standalone-chrome:4.1.4")
                .asCompatibleSubstituteFor("selenium/standalone-chrome"))
                .withCapabilities(
                    chromeOptions);
        uninitialisedContainers = new BrowserWebDriverContainer[] { firefox68Rule, chrome76Rule };
    }

    private static void setUpDrivers() {
        for (BrowserWebDriverContainer container : uninitialisedContainers) {
            if (container != null) {
                containers.add(container);
                container.start();
                drivers.add(setupDriverFromRule(container));
            }
        }
        if (drivers.isEmpty()) {
            LOGGER.warn("Using single default browser of type firefox-65 as no browsers specified");
            firefox68Rule = new BrowserWebDriverContainer(DockerImageName //NOSONAR
                .parse(
                    "armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/selenium/standalone"
                    + "-firefox:3.141.59-titanium")
                    .asCompatibleSubstituteFor(
                        "selenium/standalone-firefox"))
                    .withCapabilities(new FirefoxOptions());
            containers.add(firefox68Rule);
            firefox68Rule.start();
            drivers.add(setupDriverFromRule(firefox68Rule));
        }
    }

    private static void loginToAllDrivers() {
        for (RemoteWebDriver driver : drivers) {
            if (getHost().contains("127.0.0.1") || getHost().contains("localhost") || getHost().contains("host.testcontainers")) {
                driver.get(getHost());
            } else {
                login(driver, "superUser", ERICSSON123, "loginToAllDrivers");
            }
        }
    }

    private static void createUserIfRequired() {
        if (!getHost().contains("127.0.0.1") && !getHost().contains("localhost") && !getHost().contains("host.testcontainers")) {
            createUser(READ_ONLY_USER, "E-VNFM Read-only User Role", EVNFM_UI_USER_ROLE);
            createUser(STANDARD_USER, "E-VNFM User Role", EVNFM_UI_USER_ROLE);
            createUser(SUPER_USER, "E-VNFM Super User Role", EVNFM_UI_USER_ROLE);
            createUser(UI_USER, EVNFM_UI_USER_ROLE);
        }
    }

    private static void setFirefoxAndChromeLocal() {
        if (System.getProperty("firefox-local") != null) {
            LOGGER.info("Using local firefox browser");
            FirefoxOptions firefoxOptions = new FirefoxOptions();
            drivers.add(new FirefoxDriver(firefoxOptions));
        }
        if (System.getProperty("chrome-local") != null) {
            LOGGER.info("Using local chrome browser");
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--start-maximized");
            drivers.add(new ChromeDriver(options));
        }
        if (System.getProperty("chrome-local") == null && System.getProperty("firefox-local") == null) {
            Testcontainers.exposeHostPorts(10101);
        }
        if (System.getProperty("exposeHostPort") != null) {
            Testcontainers.exposeHostPorts(Integer.parseInt(System.getProperty("exposeHostPort")));
        }
    }

    @AfterSuite(alwaysRun = true)
    public static void stopContainersAndDrivers() {
        LOGGER.info("Closing down all containers and drivers");
        for (RemoteWebDriver driver : drivers) {
            try {
                logoutWithRetry(driver, true);
            } catch (Exception e) {
                LOGGER.warn("stopContainersAndDrivers failed to logout, attempting to quit driver anyway", e);
            } finally {
                safelyQuitWebDriver(driver);
            }
        }
        for (BrowserWebDriverContainer container : containers) {
            container.stop();
        }
        containers = new ArrayList<>();
        drivers = new ArrayList<>();
    }

    @DataProvider(name = "driver", parallel = true)
    public static Object[][] drivers() {
        Object[][] data = new Object[drivers.size()][2];
        for (int i = 0; i < drivers.size(); i++) {
            data[i][0] = drivers.get(i).getCapabilities().getBrowserVersion();
            data[i][1] = drivers.get(i);
        }
        return data;
    }

    @DataProvider(name = "sequential-driver", parallel = false)
    public static Object[][] sequentialDrivers() {
        Object[][] data = new Object[drivers.size()][2];
        for (int i = 0; i < drivers.size(); i++) {
            data[i][0] = drivers.get(i).getCapabilities().getBrowserVersion();
            data[i][1] = drivers.get(i);
        }
        return data;
    }

    private static RemoteWebDriver setupDriverFromRule(BrowserWebDriverContainer rule) {
        RemoteWebDriver driver = RemoteWebDriverCreator.from(rule).create();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2L));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(2L));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(2L));
        return driver;
    }

    public static void safelyQuitWebDriver(RemoteWebDriver driver) {
        try {
            driver.quit();
        } catch (Exception e) {
            LOGGER.error("Couldn't quit remoteWebDriver", e);
        }
    }

    public static String getHost() {
        String property = System.getProperty("container.host", "http://127.0.0.1:8080");
        LOGGER.info("Using Host: " + property);
        return property;
    }

    public static UserRepresentation getReadOnlyUser() {
        UserRepresentation readOnlyUser = new UserRepresentation();
        readOnlyUser.setEnabled(true);
        readOnlyUser.setUsername("readonly");
        readOnlyUser.setFirstName("Fred");
        readOnlyUser.setLastName("Flintstone");
        readOnlyUser.setEmail("fred.flintstone@quarry.com");

        return readOnlyUser;
    }

    public static UserRepresentation getStandardUser() {
        UserRepresentation standardUser = new UserRepresentation();
        standardUser.setEnabled(true);
        standardUser.setUsername("user");
        standardUser.setFirstName("Wilma");
        standardUser.setLastName("Flintstone");
        standardUser.setEmail("wilma.flintstone@quarry.com");

        return standardUser;
    }

    public static UserRepresentation getSuperUser() {
        UserRepresentation superUser = new UserRepresentation();
        superUser.setEnabled(true);
        superUser.setUsername("superUser");
        superUser.setFirstName("Barney");
        superUser.setLastName("Rubble");
        superUser.setEmail("barney.rubble@quarry.com");

        return superUser;
    }

    public static UserRepresentation getUIUser() {
        UserRepresentation uiUser = new UserRepresentation();
        uiUser.setEnabled(true);
        uiUser.setUsername("uiUser");
        uiUser.setFirstName("Joe");
        uiUser.setLastName("Doyle");
        uiUser.setEmail("joe.doyle@quarry.com");

        return uiUser;
    }
}
