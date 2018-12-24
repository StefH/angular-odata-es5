import { assert } from 'chai';

import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AngularODataModule } from '../src';
import { ODataConfiguration, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponseEmployeeBuilder } from './helpers/httpResponseEmployeeBuilder';

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
        const result = config.getEntityUri(123, 'Employees');

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

    it('extractQueryResultDataAsNumber', () => {
        // Assign
        const httpResponse = new HttpResponse<number>({
            body: 3,
            status: 200
        });

        // Act
        const config = new ODataConfiguration();
        const result: number = config.extractQueryResultDataAsNumber(httpResponse);

        // Assert
        assert.equal(result, 3);
    });

    it('extractQueryResultData', () => {
        // Assign
        const httpResponse = new HttpResponseEmployeeBuilder()
            .withODataCount(3)
            .build();

        // Act
        const config = new ODataConfiguration();
        const results = config.extractQueryResultData<IEmployee>(httpResponse);

        // Assert
        assert.equal(results.length, 2);
    });

    it('extractQueryResultDataWithCount', () => {
        // Assign
        const httpResponse = new HttpResponseEmployeeBuilder()
            .withODataCount(3)
            .build();

        // Act
        const config = new ODataConfiguration();
        const pagedResult = config.extractQueryResultDataWithCount<IEmployee>(httpResponse);

        // Assert
        assert.equal(pagedResult.count, 3);
        assert.equal(pagedResult.data.length, 2);
    });

    it('extractQueryResultDataWithCount (@odata.count is missing)', () => {
        // Assign
        const httpResponse = new HttpResponseEmployeeBuilder()
            .removeODataCount()
            .build();

        // Act
        const config = new ODataConfiguration();
        const pagedResult = config.extractQueryResultDataWithCount<IEmployee>(httpResponse);

        // Assert
        assert.equal(pagedResult.count, 2);
        assert.equal(pagedResult.data.length, 2);
    });

    it('extractQueryResultDataWithCount (@odata.count is invalid)', () => {
        // Assign
        const httpResponse = new HttpResponseEmployeeBuilder()
            .withODataCount('xyz')
            .build();

        // Act
        const config = new ODataConfiguration();
        const pagedResult = config.extractQueryResultDataWithCount<IEmployee>(httpResponse);

        // Assert
        assert.equal(pagedResult.count, 2);
        assert.equal(pagedResult.data.length, 2);
    });

    it('extractQueryResultDataWithCount with @odata.nextLink', () => {
        // Assign
        const httpResponse = new HttpResponseEmployeeBuilder()
            .withODataNextLink('xyz')
            .build();

        // Act
        const config = new ODataConfiguration();
        const pagedResult = config.extractQueryResultDataWithCount<IEmployee>(httpResponse);

        // Assert
        assert.equal(pagedResult.nextLink, 'xyz');
    });
});
