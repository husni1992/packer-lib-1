const Packer = require('../dist/index').default;

async function run() {
	const exampleFilePath = (__dirname, './run-example/example_input');
	const res = await Packer.pack(exampleFilePath);

	console.log(res);
}

run();
