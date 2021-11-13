export default {
	preset: 'ts-jest',
	rootDir: 'src',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testRegex: '.spec.ts$',
	testEnvironment: 'node',
};
