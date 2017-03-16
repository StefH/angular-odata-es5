import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ODataService } from './ODataService';
import { ODataConfiguration } from './ODataConfiguration';

@Injectable()
export class ODataServiceFactory {

    constructor(private http: Http, private config: ODataConfiguration) {
    }

    public CreateService<T>(typeName: string, handleError?: (err: any) => any): ODataService<T> {
        return new ODataService<T>(typeName, this.http, this.config);
    }

    public CreateServiceWithOptions<T>(typeName: string, config: ODataConfiguration): ODataService<T> {
        return new ODataService<T>(typeName, this.http, config);
    }
}
