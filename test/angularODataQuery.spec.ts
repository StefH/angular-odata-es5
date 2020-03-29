import { assert } from 'chai';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule, ODataExecReturnType } from '../src';
import { ODataConfiguration, ODataPagedResult, ODataQuery, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';
import { HttpHeadersMatcher } from './helpers/httpHeadersMatcher';
import { HttpOptionsMatcher } from './helpers/httpOptionsMatcher';
import { HttpResponseEmployeeBuilder } from './helpers/httpResponseEmployeeBuilder';

export class ODataQueryMock extends ODataQuery<IEmployee> {

    public Exec(): Observable<IEmployee[]>;
    public Exec(returnType: ODataExecReturnType.Count): Observable<number>;
    public Exec(returnType: ODataExecReturnType.PagedResult): Observable<ODataPagedResult<IEmployee>>;
    public Exec(returnType?: ODataExecReturnType): Observable<IEmployee[] | ODataPagedResult<IEmployee> | number> {
        switch (returnType) {
            case ODataExecReturnType.Count:
                return of(0);

            case ODataExecReturnType.PagedResult:
                const pagedResult = new ODataPagedResult<IEmployee>();
                pagedResult.count = 0;
                pagedResult.data = new Array<IEmployee>();

                return of(pagedResult);

            default:
                return of(new Array<IEmployee>());
        }
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

    it('GetUrl no params', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        // Act
        const result = query.GetUrl();

        // Assert
        assert.equal(result, 'http://localhost/odata/Employees');
    }));

    it('GetUrl', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        query
            .Filter(`x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z`)
            .Apply(['groupby((Age))'])
            .Expand('EXP')
            .Top(10)
            .Skip(20)
            .Select(['s1', 's2', 'Boss/Select'])
            .OrderBy(['y', 'Boss/OrderBy']);

        // Act
        const result = query.GetUrl();

        // Assert
        assert.equal(result, 'http://localhost/odata/Employees?$expand=EXP,Boss($select=Select)&$select=s1,s2&$filter=x%20gt%201%20and%20Boss/Filter%20eq%2042%20and%20EndDate%20lt%202018-02-07T09:58:30.897Z&$top=10&$skip=20&$orderby=y,Boss/OrderBy&$apply=groupby((Age))');
    }));

    it('GetUrl with Count', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        query
            .Filter(`x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z`)
            .Apply(['groupby((Age))'])
            .Expand('EXP')
            .Top(10)
            .Skip(20)
            .Select(['s1', 's2', 'Boss/Select'])
            .OrderBy(['y', 'Boss/OrderBy']);

        // Act
        const result = query.GetUrl(ODataExecReturnType.Count);

        // Assert
        assert.equal(result, 'http://localhost/odata/Employees/$count?$expand=EXP,Boss($select=Select)&$select=s1,s2&$filter=x%20gt%201%20and%20Boss/Filter%20eq%2042%20and%20EndDate%20lt%202018-02-07T09:58:30.897Z&$top=10&$skip=20&$orderby=y,Boss/OrderBy&$apply=groupby((Age))');
    }));

    it('Exec', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        query
            .Filter(`x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z`)
            .Search('f')
            .Apply(['groupby((Age))'])
            .Expand('EXP')
            .Top(10)
            .Skip(20)
            .Select(['s1', 's2', 'Boss/Select'])
            .OrderBy(['y', 'Boss/OrderBy']);

        const result = query.Exec();

        const params = new HttpParams()
            .append(config.keys.expand, `EXP,Boss(${config.keys.select}=Select)`)
            .append(config.keys.select, 's1,s2')
            .append(config.keys.filter, 'x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z')
            .append(config.keys.search, 'f')
            .append(config.keys.top, '10')
            .append(config.keys.skip, '20')
            .append(config.keys.orderBy, 'y,Boss/OrderBy')
            .append(config.keys.apply, 'groupby((Age))');

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

    it('Exec Count', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        const response = new HttpResponse<number>({
            body: 5,
            status: 200
        });

        spyOn(http, 'get').and.returnValue(Observable.create(response));

        // Act
        query
            .Filter(`x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z`)
            .Apply(['groupby((Age))'])
            .Expand('EXP')
            .Top(10)
            .Skip(20)
            .Select(['s1', 's2', 'Boss/Select'])
            .OrderBy(['y', 'Boss/OrderBy']);

        const result: Observable<number> = query.Exec(ODataExecReturnType.Count);

        const params = new HttpParams()
            .append(config.keys.expand, `EXP,Boss(${config.keys.select}=Select)`)
            .append(config.keys.select, 's1,s2')
            .append(config.keys.filter, 'x gt 1 and Boss/Filter eq 42 and EndDate lt 2018-02-07T09:58:30.897Z')
            .append(config.keys.top, '10')
            .append(config.keys.skip, '20')
            .append(config.keys.orderBy, 'y,Boss/OrderBy')
            .append(config.keys.apply, 'groupby((Age))');

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
        expect(http.get).toHaveBeenCalledWith('http://localhost/odata/Employees/$count', testOptions);
    }));

    it('Exec PagedResult', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        const response = new HttpResponseEmployeeBuilder()
            .build();
        spyOn(http, 'get').and.returnValue(Observable.create(response));

        // Act
        query
            .Filter('x')
            .Top(10)
            .Skip(20)
            .OrderBy('y');

        const result = query.Exec(ODataExecReturnType.PagedResult);

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

    it('Exec PagedResult MaxPageSize', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        config.defaultRequestOptions.headers = config.defaultRequestOptions.headers.set('a', 'b');

        const query = new ODataQuery<IEmployee>('Employees', config, http);

        const response = new HttpResponseEmployeeBuilder()
            .withODataNextLink('http://localhost/odata/Employees?$skip=3"')
            .build();
        spyOn(http, 'get').and.returnValue(Observable.create(response));

        // Act
        query
            .Filter('x')
            .OrderBy('y')
            .MaxPerPage(3);

        const result = query.Exec(ODataExecReturnType.PagedResult);

        // Assert
        const params = new HttpParams()
            .append(config.keys.filter, 'x')
            .append(config.keys.orderBy, 'y')
            .append('$count', 'true');

        const outputHeaders = {
            'a': 'b',
            'Prefer': 'odata.maxpagesize=3'
        };

        const optionsMatcher = new HttpOptionsMatcher(params, new HttpHeadersMatcher(outputHeaders));

        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith('http://localhost/odata/Employees', optionsMatcher);
    }));

    it('Filter(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Filter('f');

        // Assert
        assert.equal(test['_filter'], 'f');
    }));

    it('Search(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Search('f');

        // Assert
        assert.equal(test['_search'], 'f');
    }));

    // it('Filter(string[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
    //     // Assign
    //     const test = new ODataQueryMock('Employees', config, http);

    //     // Act
    //     test.Filter(['x', 'Boss.FirstName']);

    //     // Assert
    //     assert.deepEqual(test['_filter'], ['x', 'Boss.FirstName']);
    // }));

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

    it('CustomQueryOptions(IKeyValue)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.CustomQueryOptions({ key: 'firstName', value: 'Alex' });

        // Assert
        assert.deepEqual(test['_customQueryOptions'], [{ key: 'firstName', value: 'Alex' }]);
    }));

    it('CustomQueryOptions(IKeyValue[])', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.CustomQueryOptions([{ key: 'firstName', value: 'Alex' }, { key: 'lastName', value: 'Gates' }]);

        // Assert
        assert.deepEqual(test['_customQueryOptions'], [{ key: 'firstName', value: 'Alex' }, { key: 'lastName', value: 'Gates' }]);
    }));

    it('GetUrl with CustomQueryOptions', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        query.CustomQueryOptions([{ key: 'firstName', value: 'Alex' }, { key: 'lastName', value: 'Gates' }]);

        // Act
        const result = query.GetUrl();

        // Assert
        assert.equal(result, 'http://localhost/odata/Employees?firstName=Alex&lastName=Gates');
    }));

    it('CustomQueryOptions with $ reserved character in key', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        query.CustomQueryOptions({ key: '$reserved', value: 'Secret' });

        // Act & Assert
        expect(query.GetUrl.bind(query)).toThrowError('Custom query options MUST NOT begin with a $ or @ character.');
    }));

    it('CustomQueryOptions with @ reserved character in key', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        query.CustomQueryOptions({ key: '@reserved', value: 'Secret' });

        // Act & Assert
        expect(query.GetUrl.bind(query)).toThrowError('Custom query options MUST NOT begin with a $ or @ character.');
    }));

    it('CustomQueryOptions with null key', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
      // Assign
      const query = new ODataQuery<IEmployee>('Employees', config, http);

      query.CustomQueryOptions({ key: null!, value: 'Secret' });

      // Act & Assert
      expect(query.GetUrl.bind(query)).toThrowError('Custom query options MUST NOT be null or undefined.');
    }));
});
