import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/Rx';
import { Location } from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, HttpModule } from '@angular/http';
import { IEmployee } from './helpers/employee';

import { AngularODataModule } from '../src';
import { ODataOperation, ODataServiceFactory, ODataConfiguration } from './../src/index';
import { HttpClient } from '@angular/common/http';

export class ODataOperationTest extends ODataOperation<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
    }
}

describe('ODataOperation', () => {
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

    it('Expand(string)`1', inject([ Http, ODataConfiguration ], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand('x');

        // Assert
        assert.equal(test['_expand'], 'x');
    }));

    it('Expand(string)`2', inject([ Http, ODataConfiguration ], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand('x, y');

        // Assert
        assert.equal(test['_expand'], 'x, y');
    }));

    it('Expand(string[])', inject([ Http, ODataConfiguration ], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand([ 'a', 'b' ]);

        // Assert
        assert.equal(test['_expand'], 'a,b');
    }));

    it('Select(string)', inject([ Http, ODataConfiguration ], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select('x,y,z');

        // Assert
        assert.equal(test['_select'], 'x,y,z');
    }));

    it('Select(string[])', inject([ Http, ODataConfiguration ], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select([ 'a', 'b' ]);

        // Assert
        assert.equal(test['_select'], 'a,b');
    }));
});
