# Packer

Packer is a JavaScript library for Node.js built with TypeScript that allows you to determine which items to put into the package with highest value without overloading the package. So the total weight is within the specified limit but the total value is as high as possible. You just have to provide the absolute path to a file that includes the items to choose from, and we will find which things to put in the package.


# Quick start

Install dependencies

    npm install

Build

    npm run build

Build in watch mode (Optional)

    npm run build:watch

Go to the node.js application you want to use this library. Run the below script.
This will create a symlink to the `Packer` library in your app so that you can `import packer from 'packer'`

    npm link {relative path to packer}

# Run example
You can run the Packer.pack(filePath) with the `example_input` file in `run-example/example_input` directory and see the output in console. 

Follow the steps

Install dependencies (if you haven't already)

    npm install

Run example

    npm run example

# Usage:

This is an asynchronous method, don't forget to use `await`

### Using `commonjs` import

```javascript
const Packer = require("packer").default;

await Packer.pack(absolutePathToYourFile);
```

### Using `ES6` import

```javascript
import Packer from "packer";

await Packer.pack(absolutePathToYourFile);
```

# Linting the codebase
Requirements for running linting. (I used `v16.13.0` for running, but below versions should work)

    node:   14.xx.x

Check lint errors

    npm run lint

Fix lint errors

    npm run lint:fix



# Testing

Run unit tests

    npm test

Run test in watch mode

    npm run test:watch

# API Summary

|                          |                                           |                      |
| ------------------------ | ----------------------------------------- | -------------------- |
| [`Packer.pack()`](#pack) | Determine which things to pick in package | Method type `static` |


## API

### pack(filePath: string, validateFileType: boolean)

This is an `asynchronous` static method that accepts an absolute file path. Each row is an item enclosed in parentheses where the 1st number is a item’s index number, the 2nd is its weight and the 3rd is its cost.

#### Parameters
`filePath: string`

This should be an absolute path to a UTF-8 formatted file

`validateFileType: boolean`

Passing `true` will strictly validate the file type to be UTF-8. An exception will be thrown if the validation fails.
## Example input file content

```
8 : (1,15.3,€34)
75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52)
(6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78)
56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36)
(6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)
```

## Example output

```
4-
2,7
8,9
```

# Author

M.G.Husny Ahamed

# License

MIT