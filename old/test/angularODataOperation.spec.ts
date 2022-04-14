import { assert } from 'chai';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule } from '../src';
import { ODataConfiguration, ODataOperation, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

export class ODataOperationTest extends ODataOperation<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return of(new Array<IEmployee>());
    }

    public GetUrl(): string {
        return 'http://test';
    }
}

describe('ODataOperation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpClient,
                ODataConfiguration,
                ODataServiceFactory
            ],
            imports: [
                AngularODataModule.forRoot(),
                HttpClientTestingModule
            ]
        });
    });

    it('Expand(string)`1', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand('x');

        // Assert
        assert.deepEqual(test['_expand'], ['x']);
    }));

    it('Expand(string)`2', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand('x, y');

        // Assert
        assert.deepEqual(test['_expand'], ['x', 'y']);
    }));

    it('Expand(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand(['a', 'b', 'Boss.FirstName']);

        // Assert
        assert.deepEqual(test['_expand'], ['a', 'b', 'Boss.FirstName']);
    }));

    it('Select(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select('x,y,z');

        // Assert
        assert.deepEqual(test['_select'], ['x', 'y', 'z']);
    }));

    it('Select(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select(['a', 'b']);

        // Assert
        assert.deepEqual(test['_select'], ['a', 'b']);
    }));
});
