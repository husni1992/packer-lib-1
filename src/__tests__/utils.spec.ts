import * as path from "path";

import {
  extractNumberFromText,
  removeAllWhiteSpaces,
  isLastIndex,
  findSumOfArrayByKey,
  readFileByRows,
} from "../utils";

describe("Utils", () => {
  test("should extract number from string with a char before the number", () => {
    const res = extractNumberFromText("$675");
    expect(res).toBe(675);
  });

  test("Remove trim and remove all white spaces in between", () => {
    const res = removeAllWhiteSpaces("foo    bar   baz");
    expect(res).toBe("foobarbaz");
  });

  test("check if it's the last index of an array", () => {
    const res = isLastIndex([1, 2, 3], 2);
    expect(res).toBe(true);
  });

  test("should find sum of an array of objects by given key", () => {
    const res = findSumOfArrayByKey([{ a: 1 }, { a: 2 }, { a: 3 }], "a");
    expect(res).toBe(6);
  });

  test("should read file by rows ignoring the empty lines and return as array", async () => {
    const pathForMockFile = path.resolve(__dirname, "./mocks/mock-input-1");
    const res = readFileByRows(pathForMockFile);

    expect(res).resolves.toEqual([
      "Apricot melon",
      "cheese cake",
      "marzipan cake",
      "cashew crepes",
    ]);
  });
});
