# Packer

Packer is a JavaScript library for Node.js that allows you to determine which things to put into the package so that the total weight is less than or equal to the package limit and the total cost is as large as possible. You just have to provide the absolute path to a file with data of packages, and you will get to know which things to pick in the packages.

# Installation (only after publishing as a npm package)

    npm install mobiq-packer

# Development

To setup this mobiq-packer locally, you just have to build the app running below script. And then go to the project you need to import this and `npm link`.

This will compile the typescript files to `/dist` folder.

    npm run build

This will compile the typescript files in watch mode

    npm run build:watch

Then go to the node.js application you want to use this library and run the below script

    npm link {root path of mobiq-packer}

# API Summary

|                          |                                           |                      |
| ------------------------ | ----------------------------------------- | -------------------- |
| [`Packer.pack()`](#pack) | Determine which things to pick in package | Method type `static` |

# Usage:

```javascript
import Packer from "mobiq-packer";

await Packer.pack(absolutePathToYourFile);
```

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
