import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { IEmployee } from './helpers/employee';

import { AngularODataModule } from '../src';
import { ODataOperation, ODataServiceFactory, ODataConfiguration } from './../src/index';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

describe('ODataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ODataConfiguration,
                ODataServiceFactory,
                HttpClient
            ],
            imports: [
                AngularODataModule.forRoot(),
                HttpClientTestingModule
            ]
        });
    });

    it('Construct via injection', inject([ODataServiceFactory], (factory: ODataServiceFactory) => {
        // Act
        const service = factory.CreateService<IEmployee>('Employees');

        // Assert
        assert.isNotNull(service);
    }));

    it('Get', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.Get('abc').Exec();

        // Assert
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees('abc')`, jasmine.any(Object));
    }));

    it('Query', inject([HttpClient, ODataServiceFactory, ODataConfiguration], (http: HttpClient, factory: ODataServiceFactory, config: ODataConfiguration) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.Query().Top(100).Exec();

        // Assert
        const params = new HttpParams().append(config.keys.top, '100');
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { params: params, observe: 'response' };
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees`, testOptions);
    }));

    it('Delete', inject([HttpClient, ODataServiceFactory, ODataConfiguration], (http: HttpClient, factory: ODataServiceFactory, config: ODataConfiguration) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'delete').and.returnValue(new Observable<Response>());

        // Act
        const result = service.Delete('x');

        // Assert
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { observe: 'response' };
        expect(http.delete).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, testOptions);
    }));

    it('Query and Delete using same service', inject([HttpClient, ODataServiceFactory, ODataConfiguration], (http: HttpClient, factory: ODataServiceFactory, config: ODataConfiguration) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());
        spyOn(http, 'delete').and.returnValue(new Observable<Response>());

        // Act
        const result1 = service.Query().Top(100).Exec();
        const result2 = service.Delete('x');

        // Assert GET
        const getOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { params: new HttpParams().append(config.keys.top, '100'), observe: 'response' };
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees`, getOptions);

        // Assert DELETE
        const deleteOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { observe: 'response' };
        expect(http.delete).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, deleteOptions);
    }));

    it('Custom Function 1', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction('calculateLatestTimeCard');

        // Assert
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/calculateLatestTimeCard()`, jasmine.any(Object));
    }));

    it('Custom Function 2', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction(`getSalesTaxRate(area='abc', postalCode=10)`);

        // Assert
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));

    it('Custom Function with Parameters', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction('getSalesTaxRate', { area: 'abc', postalCode: 10 });

        // Assert
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));
});
