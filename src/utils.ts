import { createReadStream, existsSync } from 'fs';
import { createInterface } from 'readline';
import { normalize } from 'path';

import { detectFileSync } from 'chardet';

import { APIException, FileNotFoundException } from './error';

// Promisified file row reader
export async function readFileByRows(
	path: string,
	validateFileType?: boolean,
): Promise<string[]> {
	// Normalize path for cross platform compatibility
	const normalizedPath = normalize(path);

	if (!existsSync(normalizedPath)) {
		throw new FileNotFoundException(`File not found at ${normalizedPath}`);
	}

	if (validateFileType) {
		if (detectFileSync(normalizedPath) !== 'UTF-8') {
			throw new APIException('File type should be UTF-8');
		}
	}

	const fileStream = createReadStream(normalizedPath, {
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

// Get rid of all white spaces it between strings
export function removeAllWhiteSpaces(text: string): string {
	return text.replace(/\s/g, '');
}

// Check if index of an array is the last item's index
export function isLastIndex(array: unknown[], itemIndex: number): boolean {
	return itemIndex === array.length - 1;
}

export function findSumOfArrayByKey(array, key: string): number {
	return array.reduce((a, b) => a + (b[key] || 0), 0);
}

// In an array of objects, check if there are duplicates in items of a specific key
export function checkIfDuplicateExists(array: unknown[], key: string): boolean {
	const extractedArrayByKey = array.map((item) => item[key]).filter(Boolean);

	// provided key does not exist in array and return void
	if (array.length && !extractedArrayByKey.length) {
		return;
	}

	return array.length !== new Set(extractedArrayByKey).size;
}
