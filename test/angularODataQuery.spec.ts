import { assert } from 'chai';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule, ODataExecReturnType } from '../src';
import { ODataConfiguration, ODataPagedResult, ODataQuery, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

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

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

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

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

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

    it('Filter(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Filter('f');

        // Assert
        assert.equal(test['_filter'], 'f');
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

    it('Skip(null)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Skip(null);

        // Assert
        assert.equal(test['_skip'], null);
    }));

    it('Top(number)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Top(20);

        // Assert
        assert.equal(test['_top'], 20);
    }));

    it('Top(null)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Top(null);

        // Assert
        assert.equal(test['_top'], null);
    }));

    it('Apply(string)', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const test = new ODataQueryMock('Employees', config, http);

        // Act
        test.Apply('groupby((LastName))');

        // Assert
        assert.deepEqual(test['_apply'], ['groupby((LastName))']);
    }));

    it('Exec PagedResult MaxPageSize', inject([HttpClient, ODataConfiguration], (http: HttpClient, config: ODataConfiguration) => {
        // Assign
        const testHeaders = new HttpHeaders({ 'a': 'b' });
        config.defaultRequestOptions = { headers: testHeaders, observe: 'response' };
        const query = new ODataQuery<IEmployee>('Employees', config, http);

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        query
            .Filter('x')
            .OrderBy('y')
            .MaxPerPage(3);

        const result = query.Exec(ODataExecReturnType.PagedResult);

        const params = new HttpParams()
            .append(config.keys.filter, 'x')
            .append(config.keys.orderBy, 'y')
            .append('$count', 'true');

        // Assert
        const outputHeaders = new HttpHeaders({ 
            'a': 'b',
            'Prefer': 'odata.maxpagesize=3'
        });
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { headers: outputHeaders, params: params, observe: 'response' };
        
        // Hack to force the values to apply so test compare works.
        testOptions.headers.keys();

        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith('http://localhost/odata/Employees', testOptions);
    }));
});
