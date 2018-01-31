import { assert } from 'chai';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule } from '../src';
import { ODataConfiguration, ODataPagedResult, ODataQuery, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

export class ODataQueryMock extends ODataQuery<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
    }

    public ExecWithCount(): Observable<ODataPagedResult<IEmployee>> {
        const pagedResult = new ODataPagedResult<IEmployee>();
        pagedResult.count = 0;
        pagedResult.data = new Array<IEmployee>();

        return Observable.of(pagedResult);
    }
}

describe('ODataQuery', () => {
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

    it('TestBaseUrl', inject([HttpClient], (http: HttpClient) => {
        // Assign
        const config = new ODataConfiguration();
        config.baseUrl = 'http://test.org/odata';

        // https://blog.thoughtram.io/angular/2016/11/28/testing-services-with-http-in-angular-2.html
        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = new ODataQuery<IEmployee>('Employees', config, http).Exec();

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith('http://test.org/odata/Employees', jasmine.any(Object));
    }));

    it('Exec', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        query
            .Filter(['x', 'Boss.Filter'])
            .Expand('EXP')
            .Top(10)
            .Skip(20)
            .Select(['s1', 's2', 'Boss.Select'])
            .OrderBy(['y', 'Boss.OrderBy']);

        const result = query.Exec();

        const params = new HttpParams()
            .append(config.keys.expand, `EXP,Boss(${config.keys.select}=Select)`)
            .append(config.keys.select, 's1,s2')
            .append(config.keys.filter, 'x,Boss/Filter')
            .append(config.keys.top, '10')
            .append(config.keys.skip, '20')
            .append(config.keys.orderBy, 'y,Boss/OrderBy');

        // Assert
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { headers: testHeaders, params: params, observe: 'response' };

        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith('http://localhost/odata/Employees', testOptions);
    }));

    it('ExecWithCount', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        query
            .Filter('x')
            .Top(10)
            .Skip(20)
            .OrderBy('y');

        const result = query.ExecWithCount();

        const params = new HttpParams()
            .append(config.keys.filter, 'x')
            .append(config.keys.top, '10')
            .append(config.keys.skip, '20')
            .append(config.keys.orderBy, 'y')
            .append('$count', 'true');

        // Assert
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { headers: testHeaders, params: params, observe: 'response' };

        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith('http://localhost/odata/Employees', testOptions);
    }));

    it('Filter(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Filter('f');

        // Assert
        assert.deepEqual(test['_filter'], ['f']);
    }));

    it('Filter(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Filter(['x', 'Boss.FirstName']);

        // Assert
        assert.deepEqual(test['_filter'], ['x', 'Boss.FirstName']);
    }));

    it('OrderBy(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.OrderBy('o');

        // Assert
        assert.deepEqual(test['_orderBy'], ['o']);
    }));

    it('OrderBy(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.OrderBy(['o', 'Boss.FirstName']);

        // Assert
        assert.deepEqual(test['_orderBy'], ['o', 'Boss.FirstName']);
    }));

    it('Skip(number)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Skip(10);

        // Assert
        assert.equal(test['_skip'], 10);
    }));

    it('Top(number)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Top(20);

        // Assert
        assert.equal(test['_top'], 20);
    }));

    it('Apply(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Apply('groupby((LastName))');

        // Assert
        assert.deepEqual(test['_apply'], ['groupby((LastName))']);
    }));
});
