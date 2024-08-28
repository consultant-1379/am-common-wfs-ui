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

class LoggerService {
  constructor() {
    const isDebugMode = localStorage.getItem("__evnfm-debug");

    this.enabled = Boolean(isDebugMode);
  }

  log(...message) {
    if (this.enabled) {
      console.log("INFO -", ...message);
    }
  }

  warn(...message) {
    if (this.enabled) {
      console.warn("WARN -", ...message);
    }
  }

  error(...message) {
    if (this.enabled) {
      console.error("ERROR -", ...message);
    }
  }
}

const logger = new LoggerService();

export { logger };
