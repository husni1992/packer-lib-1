# Packer

Packer is a JavaScript library for Node.js built with TypeScript that allows you to determine which items to put into the package with highest value without overloading the package. So the total weight is within the specified limit but the total value is as high as possible. You just have to provide the absolute path to a file that includes the items to choose from, and we will find which things to put in the package.
 
# Supported environments
    node

# Quick start

1. Install dependencies

        npm install

2. Compile

        npm run build

3. Compile in watch mode (Optional)

        npm run build:watch

4. Go to the node.js application you want to use this library and run the below script.
This will create a symlink to the `Packer` library in your app. 

        npm link {path to packer}

# Run sample
You can run the Packer.pack(filePath) with the example_input file in `run-example/example_input` and see the output in console. 

Run `npm install` and then Run below command from root.

    npm run example

# Usage:

```javascript
import Packer from "packer";

await Packer.pack(absolutePathToYourFile);
```

# Linting the codebase
Check lint errors

    npm run lint

Fix lint errors

    npm run lint:fix
Requirements for running linting
```
node:   14.xx.x
```

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

### pack

This is a static method that accepts an absolute file path. Each row is an item enclosed in parentheses where the 1st number is a item’s index number, the 2nd is its weight and the 3rd is its cost.

## Example file content

```
8 : (1,15.3,€34)
75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52)
(6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78)
56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36)
(6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)
```

## Example output from pack()

```
4-
2,7
8,9
```

# Author

M.G.Husny Ahamed

# License

MIT