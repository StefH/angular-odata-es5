import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, HttpModule } from '@angular/http';
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
                BaseRequestOptions,
                MockBackend,
                // {
                //     provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                //         return new Http(backend, defaultOptions);
                //     },
                //     deps: [MockBackend, BaseRequestOptions]
                // },
                // {
                //     provide: Location, useFactory: () => {
                //         return {
                //             path: 'http://localhost/test'
                //         };
                //     }
                // },
                ODataConfiguration,
                ODataServiceFactory,
                HttpClientTestingModule
            ],
            imports: [
                AngularODataModule.forRoot(),
                HttpModule
            ]
        });
    });

    it('Construct via injection', inject([ ODataServiceFactory ], (factory: ODataServiceFactory) => {
        // Act
        const service = factory.CreateService<IEmployee>('Employees');

        // Assert
        assert.isNotNull(service);
    }));

    it('Get', inject([ HttpClient, ODataServiceFactory ], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.Get('abc').Exec();

        // Assert
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees('abc')`, jasmine.any(Object));
    }));

    it('Custom Function 1', inject([ HttpClient, ODataServiceFactory ], (http: HttpClient, factory: ODataServiceFactory) => {
      // Assign
      const service = factory.CreateService<IEmployee>('Employees');

      spyOn(http, 'get').and.returnValue(new Observable<Response>());

      // Act
      const result = service.CustomFunction('calculateLatestTimeCard')

      // Assert
      expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/calculateLatestTimeCard()`, jasmine.any(Object));
  }));

  it('Custom Function 2', inject([ HttpClient, ODataServiceFactory ], (http: HttpClient, factory: ODataServiceFactory) => {
      // Assign
      const service = factory.CreateService<IEmployee>('Employees');

      spyOn(http, 'get').and.returnValue(new Observable<Response>());

      // Act
      const result = service.CustomFunction(`getSalesTaxRate(area='abc', postalCode=10)`)

      // Assert
      expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
  }));

  it('Custom Function with Parameters', inject([ HttpClient, ODataServiceFactory ], (http: HttpClient, factory: ODataServiceFactory) => {
      // Assign
      const service = factory.CreateService<IEmployee>('Employees');

      spyOn(http, 'get').and.returnValue(new Observable<Response>());

      // Act
      const result = service.CustomFunction('getSalesTaxRate', { area: 'abc', postalCode: 10 })

      // Assert
      expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
  }));
});
