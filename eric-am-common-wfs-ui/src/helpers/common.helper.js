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

export function sleep(timer) {
  return new Promise(resolve => setTimeout(resolve, timer));
}

export function generateSubtitleByPage(page) {
  const { totalElements = 0, totalPages = 0, size = 0, number = 0 } = page;
  const lastNumber = totalPages === number ? totalElements : number * size;
  const firstNumber = number * size - size + 1;

  return totalElements === 0
    ? '(0)'
    : `(${firstNumber} - ${lastNumber} of ${totalElements})`;
}

export function checkIsLastRowOnPage(page) {
  if (page.number === page.totalPages) {
    const emptyRowsOnLastPage = page.number * page.size - page.totalElements;

    return page.size - emptyRowsOnLastPage === 1;
  }

  return false;
}

/**
 * Update state for columns with specific context
 *
 * @private
 * @param {object} params: specific column with new information
 */
export function updateColumnState(params) {
  const { columns, updatedColumn, defaultColumnsState } = params;

  return columns.map(item =>
    item.attribute === updatedColumn.attribute
      ? updatedColumn
      : defaultColumnsState.find(
          defaultItem => defaultItem.attribute === item.attribute,
        ),
  );
}

export function resetForm(elements) {
  const TYPES = Object.freeze({
    'eui-checkbox': 'checked',
    'eui-text-field': 'text',
  });

  elements.forEach(element => {
    const { localName } = element;
    const type = TYPES[localName];

    switch (type) {
      case 'checked':
        element.checked = false;
        break;
      case 'text':
        element.value = '';
    }
  });
}

export function returnExtension(value) {
  const lastIndex = value.lastIndexOf('.');
  if (lastIndex !== -1) {
    return value.substring(lastIndex + 1);
  }
  return '';
}

export function toTitleCase(input) {
  return input.replace(/[\w]/g, (match, offset) =>
    offset === 0 ? match.toUpperCase() : match.toLowerCase(),
  );
}
