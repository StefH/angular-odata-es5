# Angular OData Library (es5)
[![Build Status](https://travis-ci.org/StefH/angular-odata-es5.svg?branch=master)](https://travis-ci.org/StefH/angular-odata-es5)
[![codecov](https://codecov.io/gh/StefH/angular-odata-es5/branch/master/graph/badge.svg)](https://codecov.io/gh/StefH/angular-odata-es5)
[![npm version](https://badge.fury.io/js/angular-odata-es5.svg)](http://badge.fury.io/js/angular-odata-es5)
[![devDependency Status](https://david-dm.org/StefH/angular-odata-es5/dev-status.svg)](https://david-dm.org/StefH/angular-odata-es5?type=dev)

## Demo
https://StefH.github.io/angular-odata-es5/demo/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

... todo ...

## Installation

Install through npm:
```
npm install --save angular-odata-es5
```

Then include in your apps module:

```typescript
import { Component, NgModule } from '@angular/core';
import { AngularODataModule } from 'angular-odata-es5';

@NgModule({
  imports: [
    AngularODataModule.forRoot()
  ]
})
export class MyModule {}
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: '<hello-world></hello-world>'
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/StefH/angular-odata-es5/blob/master/demo/demo.component.ts).

### Usage without a module bundler
```
<script src="node_modules/angular-odata-es5/bundles/angular-odata-es5.umd.js"></script>
<script>
    // everything is exported AngularODataES5 namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://StefH.github.io/angular-odata-es5/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
