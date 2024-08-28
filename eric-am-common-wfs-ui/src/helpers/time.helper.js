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

import dayjs from 'dayjs/esm';

/**
 * Get a formatted date like "2023-10-10 23:40"
 *
 * @param {string} date: string including date format
 * @returns {string}
 */
export function formatDateAndTime(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}
