import * as fs from "fs";
import { createInterface, Interface } from "readline";

// Eg: convert €45 to 45
export function extractNumberFromText(text: string): number {
  return Number(text.replace(/^\D+/g, ""));
}

export function removeAllWhiteSpaces(text: string): string {
  return text.replace(/\s/g, "");
}

export async function readFileByRows(path): Promise<string[]> {
  const fileStream = fs.createReadStream(path, {
    encoding: "utf8",
    autoClose: true,
  });

  const rd = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines: string[] = [];
  rd.on("line", (line: string) => {
    // push only if it's not an empty line
    if (line.trim()) {
      lines.push(line);
    }
  });

  return new Promise((resolve) => {
    rd.on("close", () => {
      resolve(lines);
    });
  });
}

export function isLastIndex(array: any[], itemIndex: number): boolean {
  return itemIndex === array.length - 1;
}

export function findSumOfArrayByKey(array, key): number {
  return array.reduce((a, b) => a + (b[key] || 0), 0);
}
