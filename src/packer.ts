import { MAX_ITEMS_OF_PACKAGE, MAX_WEIGHT_OF_PACKAGE, MAX_WEIGHT_AND_COST_OF_ITEM } from './consts';
import {
	readFileByRows,
	findSumOfArrayByKey,
	isLastIndex,
	removeAllWhiteSpaces,
	extractNumberFromText,
	checkIfDuplicateExists,
} from './utils';
import { APIException } from './error';

interface ItemDetails {
	index: number;
	weight: number;
	cost: number;
	row: number;
}

interface ItemGroup {
	totalCost: number;
	totalWeight: number;
	group: ItemDetails[];
}

interface ItemRow {
	// TODO: add rowNumber
	maxWeight: number;
	itemsInPackage: ItemDetails[];
}

export default class Packer {
	static async pack(filePath: string): Promise<string> {
		const fileData = await readFileByRows(filePath);
		const fileRowData = Packer.extractRowData(fileData);

		Packer.validateData(fileRowData);

		const result = fileRowData.map((row) => {
			const combinations = Packer.findPossibleCombinationsOfItemsInRow(
				row.maxWeight,
				row.itemsInPackage,
			);
			if (!combinations.length) return null;

			return Packer.findSuitableGroupOfItems(combinations);
		});

		return Packer.formatResponseData(result);
	}

	private static validateData(rowData: ItemRow[]) {
		for (const row of rowData) {
			// 1. Max weight that a package can take is ≤ 100
			if (row.maxWeight > MAX_WEIGHT_OF_PACKAGE) {
				throw new APIException(
					`Total weight of the package cannot exceed ${MAX_WEIGHT_OF_PACKAGE}`,
				);
			}

			// 2. Max weight and cost of an item is ≤ 100
			for (const item of row.itemsInPackage) {
				if (item.weight > MAX_WEIGHT_AND_COST_OF_ITEM) {
					throw new APIException(
						`Weight of item in row '${item.row}' at index '${item.index}' is ${item.weight}. Maximum allowed is ${MAX_WEIGHT_AND_COST_OF_ITEM}`,
					);
				}

				if (item.cost > MAX_WEIGHT_AND_COST_OF_ITEM) {
					throw new APIException(
						`Cost of item in row '${item.row}' at index '${item.index}' is ${item.cost}. Maximum allowed is ${MAX_WEIGHT_AND_COST_OF_ITEM}`,
					);
				}
			}

			// 3. There can be up to only 15 items in a package
			if (row.itemsInPackage.length > MAX_ITEMS_OF_PACKAGE) {
				//TODO: mention rowNumber
				throw new APIException(`Only ${MAX_ITEMS_OF_PACKAGE} items allowed per package`);
			}
		}
	}

	private static extractRowData(rows: string[]): ItemRow[] {
		let row = 0;
		const results = [];

		const regex = /^(.+?):|\((.*?)\)/g;
		for (const line of rows) {
			row += 1;

			if (!line) break;

			const items = line.match(regex);

			const maxWeight = parseInt(items[0]);

			const itemsInPackage = items.slice(1, items.length).map((text) => {
				text = removeAllWhiteSpaces(text);

				const item = text.match(/[^(,)]+/g);
				return {
					row,
					index: Number(item[0]),
					weight: Number(item[1]),
					cost: extractNumberFromText(item[2]),
				};
			});

			// Throw if item index is duplicated in a row
			if (checkIfDuplicateExists(itemsInPackage, 'index') === true) {
				throw new APIException(`Duplicate item index found in row: ${row}`);
			}

			results.push({
				maxWeight,
				itemsInPackage,
			});
		}

		return results;
	}

	private static sortByHighestCostAndLowestWeight(array) {
		return array.sort((a, b) => b.totalCost - a.totalCost || a.totalWeight - b.totalWeight);
	}

	private static findSuitableGroupOfItems(groupsOfItems: ItemDetails[][]): ItemGroup {
		const summedList = groupsOfItems.map((group) => {
			const totalCost = findSumOfArrayByKey(group, 'cost');
			const totalWeight = findSumOfArrayByKey(group, 'weight');

			return {
				totalCost,
				totalWeight,
				group,
			};
		});

		const [sorted] = Packer.sortByHighestCostAndLowestWeight(summedList);

		return sorted;
	}

	private static findPossibleCombinationsOfItemsInRow(
		maxWeight: number,
		items: ItemDetails[],
	): ItemDetails[][] {
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

			// Only push items within the weight limit
			if (temp.length && findSumOfArrayByKey(temp, 'weight') <= maxWeight) {
				combination.push(temp);
			}
		}

		return combination;
	}

	private static formatResponseData(data: ItemGroup[] | null): string {
		let csvString = '';

		data.forEach((row, i) => {
			if (!row) {
				csvString += '-\n';
				return;
			}

			row.group.forEach((item, j) => {
				csvString += `${item.index}${!isLastIndex(row.group, j) ? ',' : ''}`;
			});

			if (!isLastIndex(data, i)) {
				csvString += '\n';
			}
		});

		return csvString;
	}
}
