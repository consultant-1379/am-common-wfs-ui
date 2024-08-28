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

import java.lang.reflect.Field;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.atomic.AtomicReference;

import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.remote.http.Filter;
import org.openqa.selenium.remote.http.HttpHandler;
import org.openqa.selenium.remote.http.HttpResponse;
import org.openqa.selenium.remote.http.RetryRequest;

import dev.failsafe.Failsafe;
import dev.failsafe.Fallback;
import dev.failsafe.RetryPolicy;

public class RetryRequestFilter implements Filter {
    private static final AtomicReference<HttpResponse> fallBackResponse = new AtomicReference<>();
    private static final Fallback<Object> fallback = Fallback.of(fallBackResponse::get);
    private static final RetryPolicy<Object> serverErrorPolicy = getStaticRetryPolicyFromRetryRequest("serverErrorPolicy");
    private static final RetryPolicy<Object> connectionFailurePolicy = getStaticRetryPolicyFromRetryRequest("connectionFailurePolicy");

    private static final RetryPolicy<Object> readTimeoutPolicy =
            RetryPolicy.builder()
                    .handle(TimeoutException.class)
                    .withBackoff(1, 4, ChronoUnit.SECONDS)
                    .withMaxRetries(3)
                    .withMaxDuration(Duration.ofSeconds(10))
                    .build();

    @SuppressWarnings("unchecked")
    private static RetryPolicy<Object> getStaticRetryPolicyFromRetryRequest(String name) {
        final RetryRequest retryRequest = new RetryRequest();
        Field connectionFailurePolicy;
        try {
            connectionFailurePolicy = retryRequest.getClass().getDeclaredField(name);
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
        try {
            connectionFailurePolicy.setAccessible(true);
            return (RetryPolicy<Object>) connectionFailurePolicy.get(retryRequest);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public HttpHandler apply(HttpHandler next) {
        return req -> Failsafe
                .with(fallback)
                .compose(serverErrorPolicy)
                .compose(readTimeoutPolicy)
                .compose(connectionFailurePolicy)
                .get(() -> next.execute(req));
    }
}
