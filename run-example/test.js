const Packer = require('../dist/index');

async function run() {
	const exampleFilePath = (__dirname, './run-example/example_input');
	const res = await Packer.default.pack(exampleFilePath);

	console.log(res);
}

run();
