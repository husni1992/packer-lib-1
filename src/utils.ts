import { createReadStream, existsSync } from 'fs';
import { normalize } from 'path';
import { createInterface } from 'readline';

import { APIException } from './error';

// Promisified file row reader
export async function readFileByRows(path): Promise<string[]> {
	if (!existsSync(normalize(path))) {
		throw new APIException(`File not found at ${normalize(path)}`);
	}

	const fileStream = createReadStream(normalize(path), {
		encoding: 'utf8',
		autoClose: true,
	});

	const rd = createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const lines: string[] = [];
	rd.on('line', (line: string) => {
		// push only the non empty lines
		if (line.trim()) {
			lines.push(line);
		}
	});

	return new Promise((resolve) => {
		rd.on('close', () => {
			resolve(lines);
		});
	});
}

// Eg: convert €45 to 45
export function extractNumberFromText(text: string): number {
	return Number(text.replace(/^\D+/g, ''));
}

export function removeAllWhiteSpaces(text: string): string {
	return text.replace(/\s/g, '');
}

export function isLastIndex(array: unknown[], itemIndex: number): boolean {
	return itemIndex === array.length - 1;
}

export function findSumOfArrayByKey(array, key): number {
	return array.reduce((a, b) => a + (b[key] || 0), 0);
}
