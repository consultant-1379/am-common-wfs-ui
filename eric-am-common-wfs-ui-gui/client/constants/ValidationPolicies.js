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
export const NAMESPACE_VALIDATION_POLICY = {
  maxLength: {
    value: 63,
    message: "Namespace must not be longer than 63 characters."
  },
  minLength: {
    value: 2,
    message: "Namespace should contain at least 2 characters"
  },
  patterns: [
    {
      pattern: "^[a-z0-9]",
      message: "Must start and end with an alphanumeric character"
    },
    {
      pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
      message:
        "Must consist of lower case alphanumeric characters or '-' (e.g. 'my-name',  or '123-abc')."
    },
    {
      pattern: "(?=.*?[a-z]|[A-Z])",
      message:
        "Must consist of at least one alphabet character"
    }
  ]
};

export const INSTANCE_NAME_VALIDATION_POLICY = {
  maxLength: {
    value: 50,
    message: "Resource instance name must not be longer than 50 characters."
  },
  isRequired: {
    value: true,
    message: "Field cannot be empty"
  },
  patterns: [
    {
      pattern: "^[a-z]",
      message: "Must start with an alphabetic character and end with an alphanumeric character"
    },
    {
      pattern: "^[a-z]([-a-z0-9]*[a-z0-9])?$",
      message: "Characters other than start and end characters can be alphanumeric or '-'."
    }
  ]
};

export const HELM_FILE_VERSION_POLICY = {
  isRequired: {
    value: true,
    message: "Field cannot be empty"
  },
  patterns: [
    {
      pattern: /^3.8$|^3.10$|^3.12$|^3.13$|^3.14$|^latest$/,
      message: "Must be a valid version (e.g. 3.8, 3.10, 3.12, 3.13, 3.14, latest)"
    }
  ]
};

export const TIMEOUT_VALIDATION_POLICY = {
  maxRange: {
    value: 1000000000,
    message: "Must be between 0 and 1,000,000,000 (1 billion)"
  },
  isRequired: {
    value: false,
    message: "Field cannot be empty"
  },
  patterns: [
    {
      pattern: /^\d+$/,
      message: "Input must be a positive numeric value"
    }
  ]
};

export const DYNAMIC_SCALE_VALIDATION_POLICY = (rules) => {
  const { min = 0, max } = rules;

  return {
    between: {
      min,
      max,
      message: `Scale level must be between ${min} and ${max}`
    }
  };
}
