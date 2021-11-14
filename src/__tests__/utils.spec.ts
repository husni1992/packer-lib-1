import * as path from 'path';

import {
	extractNumberFromText,
	removeAllWhiteSpaces,
	isLastIndex,
	findSumOfArrayByKey,
	readFileByRows,
	checkIfDuplicateExists,
} from '../utils';

describe('Utils', () => {
	test('should extract number from string with a char before the number', () => {
		const res = extractNumberFromText('$675');
		expect(res).toBe(675);
	});

	test('Remove trim and remove all white spaces in between', () => {
		const res = removeAllWhiteSpaces('foo    bar   baz');
		expect(res).toBe('foobarbaz');
	});

	test("check if it's the last index of an array", () => {
		const res = isLastIndex([1, 2, 3], 2);
		expect(res).toBe(true);
	});

	test('should find sum of an array of objects by given key', () => {
		const res = findSumOfArrayByKey(
			[
				{
					a: 1,
				},
				{
					a: 2,
				},
				{
					a: 3,
				},
			],
			'a',
		);
		expect(res).toBe(6);
	});

	describe('readFileByRows', () => {
		test('should read file by each rows and return an array except empty lines', async () => {
			const pathForMockFile = path.resolve(__dirname, './mocks/mock-input');
			const res = await readFileByRows(pathForMockFile);

			expect(res).toEqual(['Apricot melon', 'cheese cake', 'marzipan cake', 'cashew crepes']);
		});

		test('should throw FileNotFoundException if file path does not exist', async () => {
			const nonExistentPath = path.resolve(__dirname, './not-existent-path');

			await expect(readFileByRows(nonExistentPath)).rejects.toThrow(
				`File not found at ${nonExistentPath}`,
			);
		});
	});

	describe('checkIfDuplicateExists', () => {
		const itemsWithDuplicatedIndex = [
			{
				row: 1,
				index: 1,
				weight: 90.72,
				cost: 13,
			},
			{
				row: 1,
				index: 2,
				weight: 33.8,
				cost: 40,
			},
			{
				row: 1,
				index: 3,
				weight: 43.15,
				cost: 10,
			},
			{
				row: 1,
				index: 4,
				weight: 37.97,
				cost: 16,
			},
			{
				row: 1,
				index: 5,
				weight: 46.81,
				cost: 36,
			},
			{
				row: 1,
				index: 6,
				weight: 48.77,
				cost: 79,
			},
			{
				row: 1,
				index: 7,
				weight: 81.8,
				cost: 45,
			},
			{
				row: 1,
				index: 8,
				weight: 19.36,
				cost: 79,
			},
			{
				row: 1,
				index: 9,
				weight: 6.76,
				cost: 64,
			},
			{
				row: 1,
				index: 9,
				weight: 6.76,
				cost: 64,
			},
			{
				row: 1,
				index: 9,
				weight: 6.76,
				cost: 64,
			},
		];
		test('should return true if duplicates items found of a specific key in an array', () => {
			const isDuplicated = checkIfDuplicateExists(itemsWithDuplicatedIndex, 'index');

			expect(isDuplicated).toBe(true);
		});

		test('should return void invalid key provided', () => {
			const isDuplicated = checkIfDuplicateExists(itemsWithDuplicatedIndex, 'invalidKey');

			expect(isDuplicated).toBe(void 0);
		});
	});
});
