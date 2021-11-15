import {
	MAX_ITEMS_OF_PACKAGE,
	MAX_WEIGHT_AND_COST_OF_ITEM,
	MAX_WEIGHT_OF_PACKAGE,
} from './consts';
import {
	checkIfDuplicateExists,
	extractNumberFromText,
	findSumOfArrayByKey,
	isLastIndex,
	readFileByRows,
	removeAllWhiteSpaces,
} from './utils';
import { APIException } from './error';

interface Item {
	index: number;
	weight: number;
	cost: number;
}

interface Row {
	rowNumber: number;
	maxWeight: number;
	itemsInRow: Item[];
}

interface ItemGroup {
	totalCost: number;
	totalWeight: number;
	group: Item[];
}

export default class Packer {
	static async pack(
		filePath: string,
		validateFileType?: boolean,
	): Promise<string> {
		const fileData = await readFileByRows(filePath, validateFileType);
		const fileRowData = Packer.formatRowData(fileData);

		const result = fileRowData.map((row) => {
			const combinations = Packer.getPossibleCombinationsOfItems(
				row.maxWeight,
				row.itemsInRow,
			);
			if (!combinations.length) return null;

			return Packer.pickTheIdealGroupOfItems(combinations);
		});

		return Packer.formatResponseData(result);
	}

	private static handleRowDataValidation(itemRowData: Row): void {
		// 1. Max weight that a package can take is ≤ 100
		if (itemRowData.maxWeight > MAX_WEIGHT_OF_PACKAGE) {
			throw new APIException(
				`Total weight of the package cannot exceed ${MAX_WEIGHT_OF_PACKAGE}`,
			);
		}

		// 2. Max weight and cost of an item is ≤ 100
		for (const item of itemRowData.itemsInRow) {
			if (item.weight > MAX_WEIGHT_AND_COST_OF_ITEM) {
				throw new APIException(
					`Weight of item in row '${itemRowData.rowNumber}' at index '${item.index}' is ${item.weight}. Maximum weight is ${MAX_WEIGHT_AND_COST_OF_ITEM}`,
				);
			}

			if (item.cost > MAX_WEIGHT_AND_COST_OF_ITEM) {
				throw new APIException(
					`Cost of item in row '${itemRowData.rowNumber}' at index '${item.index}' is ${item.cost}. Maximum cost is ${MAX_WEIGHT_AND_COST_OF_ITEM}`,
				);
			}
		}

		// 3. There can be up to only 15 items in a package
		if (itemRowData.itemsInRow.length > MAX_ITEMS_OF_PACKAGE) {
			throw new APIException(
				`Number of items in row ${itemRowData.rowNumber} is ${itemRowData.itemsInRow.length}. Maximum of ${MAX_ITEMS_OF_PACKAGE} items allowed per package`,
			);
		}
	}

	/*  extractRowData(["75 : (1,85.31,€29) (2,14.55,€74)"])
		returns: [{
					maxWeight: 75,
					itemsInPackage: [{
							index: 1,
							weight: 85.31,
							cost: 29
						},
						{
							index: 2,
							weight: 14.55,
							cost: 74
						},
					],
				}]
	*/
	private static formatRowData(rows: string[]): Row[] {
		const results = rows.map((line, index) => {
			const rowNumber = index + 1;

			if (!line) return null;

			// Convert "75 : (1,85.31,€29) (2,14.55,€74)" to ["75", "(1,85.31,€29)", "(2,14.55,€74)"]
			const items = line.match(/^(.+?):|\((.*?)\)/g);

			const itemsInRow = items.slice(1, items.length).map((text) => {
				text = removeAllWhiteSpaces(text);

				// Convert (2,14.55,€74) to ["2", "14.55", "€74"]
				const item = text.match(/[^(,)]+/g);
				return {
					index: Number(item[0]),
					weight: Number(item[1]),
					cost: extractNumberFromText(item[2]),
				};
			});
			const maxWeight = parseInt(items[0]);

			// Throw if item index is duplicated in a row
			if (checkIfDuplicateExists(itemsInRow, 'index') === true) {
				throw new APIException(
					`Duplicate item index found in row: ${rowNumber}`,
				);
			}

			const row = {
				rowNumber,
				maxWeight,
				itemsInRow,
			};

			// Validate data in row
			Packer.handleRowDataValidation(row);

			return row;
		});

		// Filter out empty lines
		return results.filter(Boolean);
	}

	// Get groups of all possible combinations of items.
	// * Returns only the groups of which the total weight is less than maxWeigt *
	private static getPossibleCombinationsOfItems(
		maxWeight: number,
		items: Item[],
	): Item[][] {
		const combination = [];

		let temp = [];
		const possibleNumberOfCombinations = Math.pow(2, items.length);
		for (let i = 0; i < possibleNumberOfCombinations; i += 1) {
			temp = [];
			for (let j = 0; j < items.length; j += 1) {
				if (i & Math.pow(2, j)) {
					temp.push(items[j]);
				}
			}

			// Only push items within the maxWeight limit
			if (
				temp.length &&
				findSumOfArrayByKey(temp, 'weight') <= maxWeight
			) {
				combination.push(temp);
			}
		}

		return combination;
	}

	/* 
		Pick the group of items of which the total weight is within the weight limit
		and the total cost is as large as possible
	*/
	private static pickTheIdealGroupOfItems(
		groupsOfItems: Item[][],
	): ItemGroup {
		const summedList = groupsOfItems.map((group) => {
			const totalCost = findSumOfArrayByKey(group, 'cost');
			const totalWeight = findSumOfArrayByKey(group, 'weight');

			return {
				totalCost,
				totalWeight,
				group,
			};
		});

		// Sort by highest cost and lowest weight and pick the 1st item
		const [sorted] = Packer.sortByHighestCostAndLowestWeight(summedList);

		return sorted;
	}

	private static sortByHighestCostAndLowestWeight(
		array: ItemGroup[],
	): ItemGroup[] {
		return array.sort(
			(a, b) =>
				b.totalCost - a.totalCost || a.totalWeight - b.totalWeight,
		);
	}

	private static formatResponseData(data: ItemGroup[]): string {
		let csvString = '';

		data.forEach((row, i) => {
			if (!row) {
				csvString += '-\n';
				return;
			}

			row.group.forEach((item, j) => {
				csvString += `${item.index}${
					!isLastIndex(row.group, j) ? ',' : ''
				}`;
			});

			if (!isLastIndex(data, i)) {
				csvString += '\n';
			}
		});

		return csvString;
	}
}
