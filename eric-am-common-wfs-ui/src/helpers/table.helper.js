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

// models
import { userModel } from '../data/models/user.model';

export function actionScopeFilter(action) {
  if (!action.rsname) {
    return true;
  }

  const { rsname, scope } = action;
  const userScopes = userModel.permissions[rsname] || [];

  return userScopes.includes(scope);
}

export function actionClusterFilter(row, action) {
  const { value } = action;
  const { status, isDefault } = row;

  if (value === 'deregister-cluster' && status === 'In use') {
    return false;
  }

  if (value === 'make-default' && isDefault === 'Yes') {
    return false;
  }

  return true;
}

export function checkIsLastRowOnPage(page) {
  if (page.number === page.totalPages) {
    const emptyRowsOnLastPage = page.number * page.size - page.totalElements;

    return page.size - emptyRowsOnLastPage === 1;
  }

  return false;
}
