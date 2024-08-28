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
package com.ericsson.orchestration.mgmt.wfs.ui.testware.selenium;

import java.net.URL;
import java.time.Duration;

import org.openqa.selenium.Capabilities;
import org.openqa.selenium.remote.CommandExecutor;
import org.openqa.selenium.remote.HttpCommandExecutor;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.http.ClientConfig;
import org.testcontainers.containers.BrowserWebDriverContainer;

public class RemoteWebDriverCreator {

    private final BrowserWebDriverContainer<?> container;

    private RemoteWebDriverCreator(final BrowserWebDriverContainer<?> container) {
        this.container = container;
    }

    public static RemoteWebDriverCreator from(final BrowserWebDriverContainer<?> container) {
        return new RemoteWebDriverCreator(container);
    }

    public RemoteWebDriver create() {
        return new RemoteWebDriver(createExecutor(container.getSeleniumAddress()), getCapabilities(container));
    }

    private static CommandExecutor createExecutor(final URL remoteAddress) {
        final var config = ClientConfig.defaultConfig()
                .baseUrl(remoteAddress)
                .readTimeout(Duration.ofSeconds(4))
                .withFilter(new RetryRequestFilter());

        return new HttpCommandExecutor(config);
    }

    private static Capabilities getCapabilities(final BrowserWebDriverContainer<?> container) {
        try {
            final var capabilitiesField = container.getClass().getDeclaredField("capabilities");
            capabilitiesField.setAccessible(true);

            return (Capabilities) capabilitiesField.get(container);
        } catch (final NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
