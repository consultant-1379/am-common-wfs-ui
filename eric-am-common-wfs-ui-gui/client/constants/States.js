/*
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
 */

// common
import { SUPPORTED_OPERATION, UNSUPPORTED_OPERATION } from "./Messages";

export const PENDING = "PENDING";
export const RUNNING = "RUNNING";
export const SUCCEEDED = "SUCCEEDED";
export const FAILED = "FAILED";
export const UNKNOWN = "UNKNOWN";
export const STARTING = "STARTING";
export const PROCESSING = "PROCESSING";
export const COMPLETED = "COMPLETED";
export const ROLLING_BACK = "ROLLING_BACK";
export const ROLLED_BACK = "ROLLED_BACK";
export const FAILED_TEMP = "FAILED_TEMP";
export const OKAY = "OKAY";
export const SUPPORTED_OPERATION_STATE = SUPPORTED_OPERATION.toUpperCase();
export const UNSUPPORTED_OPERATION_STATE = UNSUPPORTED_OPERATION.toUpperCase()
export const YES = "YES";
export const UPLOADING = "UPLOADING";
export const ONBOARDED = "ONBOARDED";
export const CREATED = "CREATED";
export const ERROR = "ERROR";
export const ENABLED = "ENABLED";
