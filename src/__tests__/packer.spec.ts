import * as path from 'path';

import Packer from '../packer';

describe('Packer', () => {
	test('should extract the expected combination of packages from file and return the expected results', () => {
		const res = Packer.pack(path.resolve(__dirname, './mocks/mock-package-1'));

		const resultStr = '4\n-\n2,7\n8,9\n4';
		expect(res).resolves.toBe(resultStr);
	});
});
