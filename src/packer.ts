import { APIException } from "./error";
import {
  MAX_ITEMS_OF_PACKAGE,
  MAX_WEIGHT_OF_PACKAGE,
  MAX_WEIGHT_AND_COST_OF_ITEM,
} from "./consts";
import {
  readFileByRows,
  findSumOfArrayByKey,
  isLastIndex,
  removeAllWhiteSpaces,
  extractNumberFromText,
} from "./utils";

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

interface Row {
  totalWeightAllowed: number;
  itemsInPackage: ItemDetails[];
}

export default class Packer {
  static async pack(filePath: string): Promise<string> {
    const fileData = await readFileByRows(filePath);
    const fileRowData = Packer.extractRowData(fileData);

    Packer.validateData(fileRowData);

    const result = fileRowData.map((row) => {
      const combinations = Packer.findPossibleCombinationsOfItemsInRow(
        row.totalWeightAllowed,
        row.itemsInPackage
      );
      if (!combinations.length) return null;

      return Packer.findSuitableGroupOfItems(combinations);
    });

    return Packer.formatResponseData(result);
  }

  /* Validate
    1. Max weight that a package can take is ≤ 100
    2. Max weight and cost of an item is ≤ 100
    3. There might be up to 15 items you need to choose from
  */
  private static validateData(rowData: Row[]) {
    for (const row of rowData) {
      if (row.totalWeightAllowed > MAX_WEIGHT_OF_PACKAGE) {
        throw new APIException(
          `Total weight of the package can take cannot exceed ${MAX_WEIGHT_OF_PACKAGE}`
        );
      }

      for (const item of row.itemsInPackage) {
        if (
          item.weight > MAX_WEIGHT_AND_COST_OF_ITEM ||
          item.cost > MAX_WEIGHT_AND_COST_OF_ITEM
        ) {
          throw new APIException(
            `Cost/weight of ${item.index}th item in row ${item.row} has exceeded the maximum of ${MAX_WEIGHT_AND_COST_OF_ITEM}`
          );
        }
      }

      if (row.itemsInPackage.length > MAX_ITEMS_OF_PACKAGE) {
        throw new APIException(
          `Only ${MAX_WEIGHT_OF_PACKAGE} items allowed per package`
        );
      }

      const totalWeight = findSumOfArrayByKey(row.itemsInPackage, "weight");
    }
  }

  private static extractRowData(rows: string[]): Row[] {
    let row = 0;
    const results = [];

    const regex = /^(.+?):|\((.*?)\)/g;
    for (const line of rows) {
      row += 1;

      if (!line) break;

      const items = line.match(regex);

      const totalWeightAllowed = parseInt(items[0]);
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

      results.push({ totalWeightAllowed, itemsInPackage });
    }

    return results;
  }

  private static sortByHighestCostAndLowestWeight(array) {
    return array.sort(
      (a, b) => b.totalCost - a.totalCost || a.totalWeight - b.totalWeight
    );
  }

  private static findSuitableGroupOfItems(
    groupsOfItems: ItemDetails[][]
  ): ItemGroup {
    const summedList = groupsOfItems.map((group) => {
      const totalCost = findSumOfArrayByKey(group, "cost");
      const totalWeight = findSumOfArrayByKey(group, "weight");

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
    items: ItemDetails[]
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
      if (temp.length && findSumOfArrayByKey(temp, "weight") <= maxWeight) {
        combination.push(temp);
      }
    }

    return combination;
  }

  private static formatResponseData(data: ItemGroup[] | null): string {
    let csvString = "";

    data.forEach((row, i) => {
      if (!row) {
        csvString += "-\n";
        return;
      }

      row.group.forEach((item, j) => {
        csvString += `${item.index}${!isLastIndex(row.group, j) ? "," : ""}`;
      });

      if (!isLastIndex(data, i)) {
        csvString += "\n";
      }
    });

    return csvString;
  }
}
