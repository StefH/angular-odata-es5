import { assert } from 'chai';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule } from '../src';
import { ODataConfiguration, ODataOperation, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

export class ODataOperationTest extends ODataOperation<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
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
        assert.equal(test['_expand'], 'x');
    }));

    it('Expand(string)`2', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand('x, y');

        // Assert
        assert.equal(test['_expand'], 'x, y');
    }));

    it('Expand(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Expand(['a', 'b']);

        // Assert
        assert.equal(test['_expand'], 'a,b');
    }));

    it('Select(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select('x,y,z');

        // Assert
        assert.equal(test['_select'], 'x,y,z');
    }));

    it('Select(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataOperationTest('Employees', config, http);

        // Act
        test.Select(['a', 'b']);

        // Assert
        assert.equal(test['_select'], 'a,b');
    }));
});
