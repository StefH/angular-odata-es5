import { FactoryProvider  } from '@angular/core';
import { ODataConfiguration } from '../src/index';

export class NorthwindODataConfigurationFactory {

    constructor () {
        const odata = new ODataConfiguration();
        odata.baseUrl = 'http://services.odata.org/V4/Northwind/Northwind.svc';
        return odata;
    }
}
