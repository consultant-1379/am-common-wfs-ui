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
/*
 * This is the utility functions for Filtering.
 * Idea is to keep all Filter configuration specific data here.Filters dispatch filtering event to
 * GenericMultiPanel to process and render table data accordingly.
 */

import { PACKAGE_URL, OPERATIONS_URL } from "./RestUtils";
import { TABLE_SORTING_TYPES, updateColumnState } from "./CommonUtils";

// filter class
export const PACKAGES_FILTER_CLASS = "packageFiltering";
export const OPERATIONS_FILTER_CLASS = "operationFiltering";
export const CLUSTERS_FILTER_CLASS = "clusterFiltering";

// Filter panel date parameters mapping to appropriate data attribute for filtering logic
export const PACKAGES_DATE_ATTRIBUTE = "onboardedAt";
export const OPERATIONS_DATE_ATTRIBUTE = "stateEnteredTime";

export const FILTERING_EVENT = "onfiltering";

export const FILTERS_CLASS_URL_MAP = {};
FILTERS_CLASS_URL_MAP[PACKAGES_FILTER_CLASS] = PACKAGE_URL;
FILTERS_CLASS_URL_MAP[OPERATIONS_FILTER_CLASS] = OPERATIONS_URL;

const FILTERS_CLASS_DATE_MAP = {};
FILTERS_CLASS_DATE_MAP[PACKAGES_FILTER_CLASS] = PACKAGES_DATE_ATTRIBUTE;
FILTERS_CLASS_DATE_MAP[OPERATIONS_FILTER_CLASS] = OPERATIONS_DATE_ATTRIBUTE;

function _isDateFilterEmpty(key, value) {
  return (key === "From" || key === "To") && value === "";
}

export function buildQueryParameterJson(
  selectedFilters,
  defaultQueryString = "",
  dateQuery = "stateEnteredTime"
) {
  let queryString = defaultQueryString;
  const queryParameterAsJson = {};

  Object.entries(selectedFilters)
    .filter(entry => _isDateFilterEmpty(...entry) === false)
    .forEach(([key, value]) => {
      if (queryString !== "") {
        queryString += ";";
      }
      const isMultipleAttr = Array.isArray(value);
      switch (key) {
        case "From":
          queryString += `(gt,${dateQuery},${value}T00:00:00)`;
          break;
        case "To":
          queryString += `(lt,${dateQuery},${value}T23:59:59)`;
          break;
        default:
          if (isMultipleAttr && value.length === 1) {
            queryString += `(eq,${key},${value})`;
          } else if (isMultipleAttr) {
            queryString += `(in,${key},${value})`;
          } else {
            queryString += `(cont,${key},${value})`;
          }
          break;
      }
    });

  if (queryString) {
    queryParameterAsJson.filter = queryString;
  }
  return queryParameterAsJson;
}

export function buildPackagesQueryParameterJson(selectedFilters, defaultQueryString = "") {
  const updatedFilters = {};
  Object.keys(selectedFilters).forEach(function loopSelectedFilterKeys(key) {
    const newKey = `packages/${key}`;
    updatedFilters[newKey] = selectedFilters[key];
  });
  return buildQueryParameterJson(updatedFilters, defaultQueryString);
}

export function parseFilterQueryJson(params, dateQuery) {
  const { type, data, filter } = params;
  if (type === "sort") {
    const { attribute = "", sort = "" } = data;
    if (!attribute || !sort) {
      delete filter.sort;
      return filter;
    }
    return Object.assign(filter, { sort: `${attribute},${TABLE_SORTING_TYPES[sort]}` });
  }

  if (type === "filter") {
    const newFilter = buildQueryParameterJson(data, "", dateQuery);
    if (!newFilter.filter) {
      delete filter.filter;
      return filter;
    }
    return Object.assign(filter, newFilter, { page: 1 });
  }

  if (type === "pagination") {
    return Object.assign(filter, { page: data.currentPage });
  }
  return true;
}

export function setPaginationData(detail, defaultColumnsState, dateQuery) {
  const { type, data } = detail;
  switch (type) {
    case "sort":
      this.columns = updateColumnState({
        columns: this.columns,
        updatedColumn: data,
        defaultColumnsState
      });
      this.filterQueryJson = parseFilterQueryJson(
        Object.assign(detail, { filter: { ...this.filterQueryJson } }),
        dateQuery
      );
      break;
    case "filter":
    case "pagination":
      this.filterQueryJson = parseFilterQueryJson(
        Object.assign(detail, { filter: { ...this.filterQueryJson } }),
        dateQuery
      );
      break;
    default:
      this.filterQueryJson = {};
      this.columns = defaultColumnsState;
  }
}
