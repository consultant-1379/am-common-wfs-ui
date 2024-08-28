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

export function parseFormData(formNode) {
  const { elements } = formNode;

  return Array.from(elements)
    .filter(item => Boolean(item.name))
    .map(element => {
      const { name, checked = null } = element;
      const value = checked === null ? element.value : element.checked;

      return { name, value };
    });
}
