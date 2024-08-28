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
package com.ericsson.orchestration.mgmt.wfs.ui.testware.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(TestListener.class);
    private static final String TEST_FAILED_TEMPLATE = "Test %s failed.";

    @Override
    public void onTestStart(final ITestResult iTestResult) {

    }

    @Override
    public void onTestSuccess(final ITestResult iTestResult) {

    }

    @Override
    public void onTestFailure(final ITestResult iTestResult) {
        LOGGER.error(String.format(TEST_FAILED_TEMPLATE, iTestResult.getTestClass()),
                     iTestResult.getThrowable());
    }

    @Override
    public void onTestSkipped(final ITestResult iTestResult) {

    }

    @Override
    public void onTestFailedButWithinSuccessPercentage(final ITestResult iTestResult) {

    }

    @Override
    public void onStart(final ITestContext iTestContext) {

    }

    @Override
    public void onFinish(final ITestContext iTestContext) {

    }
}
