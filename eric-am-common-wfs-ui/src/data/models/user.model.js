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

// common libraries
import { jwtDecode } from 'jwt-decode';

let instance = null;

/**
 * This class responsible for user model
 *
 * @class UserModel
 */
class UserModel {
  rawData = null;
  tokenId = Date.now();

  constructor() {
    if (!instance) {
      instance = this;
    }
  }

  /**
   * Setter for raw data from postClaim response
   *
   * @param {object} data - data from response
   * @property {string} data.access_token - user access token
   * @property {number} data.expires_in - expiration date of token
   * @property {number} data.not-before-policy
   * @property {number} data.refresh_expires_in - expitaion date of refresh token
   * @property {string} data.refresh_token - user refresh token
   * @property {string} data.token_type - token type
   * @property {boolean} data.upgraded
   *
   * @returns {void}
   * @function setRawData
   * @public
   */
  setRawData(data) {
    this.rawData = data;
  }

  /**
   * Getter for parsed access token
   *
   * @returns {object}
   */
  get accessToken() {
    const { access_token: accessToken } = this.rawData;

    return jwtDecode(accessToken);
  }

  /**
   * Getter for parsed refresh token
   *
   * @returns {object}
   */
  get refreshToken() {
    const { refresh_token: refreshToken } = this.rawData;

    return jwtDecode(refreshToken);
  }

  /**
   * Getter for username
   *
   * @returns {string}
   */
  get username() {
    return this?.accessToken?.preferred_username || '';
  }

  /**
   * Getter for user permissions
   *
   * @returns {object}
   */
  get permissions() {
    const permissions = this?.accessToken?.authorization?.permissions || [];

    return permissions.reduce((acc, item) => {
      if (item.rsname !== 'Default Resource') {
        acc[item.rsname] = item.scopes;
      }

      return acc;
    }, {});
  }

  /**
   * Getter for user roles
   *
   * @returns {array}
   */
  get roles() {
    return this?.accessToken?.realm_access?.roles || [];
  }
}

const userModel = new UserModel();

export { userModel };
