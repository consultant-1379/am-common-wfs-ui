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

// helpers
import { updateColumnState } from './common.helper.js';

function filterEmptyValues([_, value]) {
  return Array.isArray(value) ? value.length !== 0 : value !== '';
}

export function buildQueryParameterJson(
  selectedFilters,
  defaultQueryString = '',
  dateQuery = 'stateEnteredTime',
) {
  let queryString = defaultQueryString;
  const queryParameterAsJson = {};

  Object.entries(selectedFilters)
    .filter(filterEmptyValues)
    .forEach(([key, value]) => {
      if (queryString !== '') {
        queryString += ';';
      }
      const isMultipleAttr = Array.isArray(value);

      switch (key) {
        case 'From':
          queryString += `(gt,${dateQuery},${value}T00:00:00)`;
          break;
        case 'To':
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

export function parseFilterQueryJson(params, dateQuery) {
  const { type, data, filter } = params;
  if (type === 'sort') {
    const { attribute = '', sort = '' } = data;

    if (!attribute || !sort) {
      delete filter.sort;

      return filter;
    }
    return { ...filter, sort: `${attribute},${TABLE_SORTING_TYPES[sort]}` };
  }

  if (type === 'filter') {
    const newFilter = buildQueryParameterJson(data, '', dateQuery);

    if (!newFilter.filter) {
      delete filter.filter;

      return filter;
    }
    return { ...filter, ...newFilter, page: 1 };
  }

  if (type === 'pagination') {
    return { ...filter, page: data.currentPage };
  }

  return true;
}

export function setPaginationData(detail, defaultColumnsState, dateQuery) {
  const { type, data } = detail;

  switch (type) {
    case 'sort':
      this.columns = updateColumnState({
        columns: this.columns,
        updatedColumn: data,
        defaultColumnsState,
      });
      this.filterQueryJson = parseFilterQueryJson(
        Object.assign(detail, { filter: { ...this.filterQueryJson } }),
        dateQuery,
      );
      break;
    case 'filter':
    case 'pagination':
      this.filterQueryJson = parseFilterQueryJson(
        Object.assign(detail, { filter: { ...this.filterQueryJson } }),
        dateQuery,
      );
      break;
    default:
      this.filterQueryJson = {};
      this.columns = defaultColumnsState;
  }
}
