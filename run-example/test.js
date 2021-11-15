const Packer = require('../dist/index').default;

async function run() {
	const exampleFilePath = (__dirname, './run-example/example_input');
	const res = await Packer.pack(exampleFilePath);

	console.log('> running example \n')
	console.log(res);
}

run();
