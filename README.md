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
- [Usage example](#usage)
- [Documentation](#documentation)
- [Development](#development)

## About

The goal is to create a fluent API for querying, creating, updating and deleting OData resources in Angular > 2.
Note that this library targets 'es5' so that Uglify will work correctly.

## Installation

Install through npm:
```
npm install --save angular-odata-es5
```

## Usage

```
import { ODataConfiguration, ODataServiceFactory, ODataService } from "angular-odata-es5";
import { bootstrap } from "@angular/platform/browser";
    
@Injectable()
class MyODataConfig extends ODataConfiguration{
    baseUrl="http://localhost:54872/odata/";
}

bootstrap(app, [
    provide(ODataConfiguration, { useClass:MyODataConfig}),
    ODataServiceFactory,
]

//An example model interface
interface INotification {
    Id: number;
    CommentId: number;
    Comment: IComment;
    FromId: number;
    From: IResource;
    Priority: number;
    SendDate: Date;
    IsArchived: boolean;
    Text: string;
}

//An example component
@Component({
  ...
})
export class NotyListComponent{
    private odata:ODataService<INotification>;
    constructor(private odataFactory:ODataServiceFactory, ...){
        this.odata = this.odataFactory.CreateService<INotification>("notification");
    }
    
    getOneNoty(id:int){
        this.odata.Get(id).Select("Id,Text").Expand("From,To").Exec()
        .subscribe(
            singleNoty=>{...},
            error=>{...}
        );
    }
      
      
    getNotys(){
        this.odata
        .Query()                    //Creates a query object
        .Top(this.top)    
        .Skip(this.skip)
        .Expand("Comment,From")
        .OrderBy("SendDate desc")
        .Filter(this.filterString)
        .Exec()                     //Fires the request
        .subscribe(                 //Subscribes to Observable<Array<T>>
        notys => {
            this.notys = notys;     //Do something with the result
        },
        error => {
            ...                     //Local error handler
        });
    
    }
}
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
