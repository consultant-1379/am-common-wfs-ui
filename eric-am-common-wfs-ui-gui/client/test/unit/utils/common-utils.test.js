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

import { assert, expect } from "chai";
import { isPasswordType, isComplexType } from "../../../utils/CommonUtils";

describe("Common utils tests", () => {
  describe("isPasswordType - helper", () => {
    it("should validate string includes 'password' in camel case", async () => {
        const property = "global.envVars.COMPANY_NAME_PASSWORD";
        const res = isPasswordType(property);

        assert.typeOf(res, 'boolean');
        expect(res).to.equal(true);
    });

    it("should validate string includes 'password' in random case", async () => {
      const property = "global.envVars.COMPANY_NAME_PaSsWOrD";
      const res = isPasswordType(property);

      assert.typeOf(res, 'boolean');
      expect(res).to.equal(true);
    });

    it("should return false if argument is not a string", async () => {
      const property = null;
      const res = isPasswordType(property);

      assert.typeOf(res, 'boolean');
      expect(res).to.equal(false);
    });

    it("should return false for string without word `password`", async () => {
      const property = "random.string";
      const res = isPasswordType(property);

      assert.typeOf(res, 'boolean');
      expect(res).to.equal(false);
    });
  });

  describe("isComplexType - helper", () => {
    it("should return boolean with invalid values", async () => {
        const attribute = null;
        const res = isComplexType(attribute);

        assert.typeOf(res, 'boolean');
        expect(res).to.equal(false);
    });

    it("should validate type for `list` and `map` and return true", async () => {
      const propertyList = { type: "list" };
      const propertyMap = { type: "map" };
      const resList = isComplexType(propertyList);
      const resMap = isComplexType(propertyMap);

      assert.typeOf(resList, 'boolean');
      assert.typeOf(resMap, 'boolean');
      expect(resList).to.equal(true);
      expect(resMap).to.equal(true);
    });

    it("should return false if argument type a string", async () => {
      const property = { type: "string" };
      const res = isComplexType(property);

      assert.typeOf(res, 'boolean');
      expect(res).to.equal(false);
    });
  });
});
