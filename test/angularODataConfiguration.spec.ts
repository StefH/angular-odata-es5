import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { IEmployee } from './helpers/employee';

import { AngularODataModule } from '../src';
import { ODataOperation, ODataServiceFactory, ODataConfiguration, ODataQuery, ODataPagedResult } from './../src/index';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ODataConfiguration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ODataConfiguration,
                ODataServiceFactory,
                HttpClientTestingModule
            ],
            imports: [
                AngularODataModule.forRoot()
            ]
        });
    });

    it('baseUrl', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act and Assert
        assert.equal(config.baseUrl, 'http://test.org/odata');
    });

    it('baseUrl_baseUrlWithEndingSlash', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata/';

        // Act and Assert
        assert.equal(config.baseUrl, 'http://test.org/odata');
    });

    it('baseUrl_baseUrlWithEndingSlashes', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata//';

        // Act and Assert
        assert.equal(config.baseUrl, 'http://test.org/odata');
    });

    it('getEntitiesUri', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act
        const result = config.getEntitiesUri('Employees');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees');
    });

    it('getEntitiesUri_typeNameWithEndingSlash', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act
        const result = config.getEntitiesUri('Employees/');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees');
    });

    it('getEntitiesUri_typeNameWithStartingSlash', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata//';

        // Act
        const result = config.getEntitiesUri('/Employees');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees');
    });

    it('getEntityUri_number', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act
        const result = config.getEntityUri('123', 'Employees');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees(123)');
    });

    it('getEntityUri_string', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act
        const result = config.getEntityUri('abc', 'Employees');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees(\'abc\')');
    });

    it('getEntityUri_guid', () => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // Act
        const result = config.getEntityUri('311807af-9d88-470b-8628-f1e42350c158', 'Employees');

        // Assert
        assert.equal(result, 'http://test.org/odata/Employees(311807af-9d88-470b-8628-f1e42350c158)');
    });
});
