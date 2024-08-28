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
import {
  PACKAGES_PAGE,
  RESOURCE_DETAILS_PAGE_BACKUPS_TAB,
  CISM_CLUSTERS_PAGE
} from "../constants/Messages";

/**
 * Returns custom id for context menu
 *
 * @param   row      row from the table
 * @param   pageName page on which context menu id is needed
 * @returns String   custom generated ID for context menu
 */
export function generateContextMenuIdValue(row, pageName) {
  switch (pageName) {
    case PACKAGES_PAGE:
      return `row-${row.appPkgId}`;
    case RESOURCE_DETAILS_PAGE_BACKUPS_TAB:
      return `${row.name}__${row.scope}`;
    case CISM_CLUSTERS_PAGE:
      return row.name;
    default:
      return `${row.vnfInstanceName}__${row.clusterName}`;
  }
}
