import * as path from 'path';

import Packer from '../packer';

describe('Packer', () => {
	test('should return expected indexes of item for each row', async () => {
		// This file has some redundant white spaces for testing to verify if it works as expected 
		const mockFilePath = path.resolve(__dirname, './mocks/valid-data-test');

		const res = await Packer.pack(mockFilePath);
		const resultStr = '4\n-\n2,7\n8,9\n4';

		expect(res).toBe(resultStr);
	});

	test('should throw if there are duplicated item index in a row', async () => {
		const mockFilePath = path.resolve(
			__dirname,
			'./mocks/duplicate-item-index',
		);

		await expect(Packer.pack(mockFilePath)).rejects.toThrow(
			'Duplicate item index found in row: 1',
		);
	});

	test('should throw if the total weight of the package exceeded 100', async () => {
		const mockFilePath = path.resolve(
			__dirname,
			'./mocks/over-weight-of-package-test',
		);

		await expect(Packer.pack(mockFilePath)).rejects.toThrow(
			'Total weight of the package cannot exceed 100',
		);
	});

	test('should throw if the weight of an item exceeded 100', async () => {
		const mockFilePath = path.resolve(__dirname, './mocks/over-weighted-item-test');

		await expect(Packer.pack(mockFilePath)).rejects.toThrow(
			"Weight of item in row '1' at index '3' is 150. Maximum allowed is 100",
		);
	});

	test('should throw if the cost of an item exceeded 100', async () => {
		const mockFilePath = path.resolve(__dirname, './mocks/over-cost-item-test');

		await expect(Packer.pack(mockFilePath)).rejects.toThrow(
			"Cost of item in row '1' at index '1' is 455. Maximum allowed is 100",
		);
	});

	test('should throw there are too many items in a package(row)', async () => {
		const mockFilePath = path.resolve(__dirname, './mocks/too-many-items');

		await expect(Packer.pack(mockFilePath)).rejects.toThrow(
			'Only 15 items allowed per package',
		);
	});
});
