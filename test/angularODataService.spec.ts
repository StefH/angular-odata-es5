import { assert } from 'chai';
import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AngularODataModule } from '../src';
import { ODataConfiguration, ODataServiceFactory } from './../src/index';
import { IEmployee } from './helpers/employee';

class HttpHeadersMatcher {

    constructor(private check: { [name: string]: string }) {
    }

    public asymmetricMatch(options: any): boolean {
        const headers: HttpHeaders = options.headers;

        assert.equal(options.observe, 'response');

        Object.keys(this.check)
            .forEach((key: string) => {
                assert.equal(headers.get(key), this.check[key], `The header '${key}' does not have the correct value`);
            });

        return true;
    }

    public jasmineToString(): string {
        return `<HeaderMatching: ${JSON.stringify(this.check)}>`;
    }
}

describe('ODataService', () => {
    const employee: IEmployee = {
        EmployeeID: 1,
        FirstName: 'f',
        LastName: 'l',
        City: 'c',
        BirthDate: null,
        Orders: null,
        Boss: null
    };

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

    it('Get with string key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Get('abc');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees('abc')`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees('abc')`, jasmine.any(Object));
    }));

    it('Get with number key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Get(42);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(42)`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(42)`, jasmine.any(Object));
    }));

    it('Get with uuid key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Get('3dde7303-5414-4af6-b96b-591f33d25445');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(3dde7303-5414-4af6-b96b-591f33d25445)`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(3dde7303-5414-4af6-b96b-591f33d25445)`, jasmine.any(Object));
    }));

    it('Get with bool key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Get(true);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(true)`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(true)`, jasmine.any(Object));
    }));

    it('Get with composite key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const key = { S: 'Stef', N: 500, B: true, U: '3dde7303-5414-4af6-b96b-591f33d25445' };
        const operation = service.Get(key);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(S='Stef', N=500, B=true, U=3dde7303-5414-4af6-b96b-591f33d25445)`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(S='Stef', N=500, B=true, U=3dde7303-5414-4af6-b96b-591f33d25445)`, jasmine.any(Object));
    }));

    it('Post', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');
        const employee: IEmployee = {
            EmployeeID: 1,
            FirstName: 'f',
            LastName: 'l',
            City: 'c',
            BirthDate: null,
            Orders: null,
            Boss: null
        };

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Post(employee);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees`);
        assert.isNotNull(result);
        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees`, `{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}`, jasmine.any(Object));
    }));

    it('Post with expand', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Post(employee).Expand('Boss');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees?$expand=Boss`);
        assert.isNotNull(result);

        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams.append('$expand', 'Boss');
        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees`, `{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}`, jasmine.objectContaining({ params: httpParams }));
    }));

    it('Post with custom headers', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const config = new ODataConfiguration();
        config.defaultRequestOptions.headers = new HttpHeaders({ 'Session': 'abc' });

        const service = factory.CreateService<IEmployee>('Employees', config);
        const employee: IEmployee = {
            EmployeeID: 1,
            FirstName: 'f',
            LastName: 'l',
            City: 'c',
            BirthDate: new Date(),
            Orders: null,
            Boss: null
        };

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const result = service.Post(employee).Exec();

        // Assert
        assert.isNotNull(result);

        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees`, jasmine.any(String), new HttpHeadersMatcher({ 'Session': 'abc' }));
    }));

    it('Patch with string key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');
        const employee: IEmployee = {
            EmployeeID: 1,
            FirstName: 'f',
            LastName: 'l',
            City: 'c',
            BirthDate: null,
            Orders: null,
            Boss: null
        };

        spyOn(http, 'patch').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Patch(employee, 'x');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees('x')`);
        assert.isNotNull(result);
        expect(http.patch).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, '{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}', jasmine.any(Object));
    }));

    it('Patch with number key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'patch').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Patch(null, 42);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(42)`);
        assert.isNotNull(result);
        expect(http.patch).toHaveBeenCalledWith(`http://localhost/odata/Employees(42)`, null, jasmine.any(Object));
    }));

    it('Patch with expand', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'patch').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Patch(employee, employee.EmployeeID).Expand('Boss');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(${employee.EmployeeID})?$expand=Boss`);
        assert.isNotNull(result);

        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams.append('$expand', 'Boss');
        expect(http.patch).toHaveBeenCalledWith(`http://localhost/odata/Employees(${employee.EmployeeID})`, `{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}`, jasmine.objectContaining({ params: httpParams }));
    }));

    it('Delete with string key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'delete').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Delete('x');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        const testOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { observe: 'response' };

        assert.equal(url, `http://localhost/odata/Employees('x')`);
        assert.isNotNull(result);
        expect(http.delete).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, testOptions);
    }));

    it('Delete with number key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'delete').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Delete(42);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(42)`);
        assert.isNotNull(result);
        expect(http.delete).toHaveBeenCalledWith(`http://localhost/odata/Employees(42)`, jasmine.any(Object));
    }));

    it('Put with string key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');
        const employee: IEmployee = {
            EmployeeID: 1,
            FirstName: 'f',
            LastName: 'l',
            City: 'c',
            BirthDate: null,
            Orders: null,
            Boss: null
        };

        spyOn(http, 'put').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Put(employee, 'x');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees('x')`);
        assert.isNotNull(result);
        expect(http.put).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, '{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}', jasmine.any(Object));
    }));

    it('Put with number key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'put').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Put(null, 42);
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(42)`);
        assert.isNotNull(result);
        expect(http.put).toHaveBeenCalledWith(`http://localhost/odata/Employees(42)`, null, jasmine.any(Object));
    }));

    it('Put with uuid key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');
        const employee: IEmployee = <IEmployee>{};

        spyOn(http, 'put').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Put(employee, '3dde7303-5414-4af6-b96b-591f33d25445');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(3dde7303-5414-4af6-b96b-591f33d25445)`);
        assert.isNotNull(result);
        expect(http.put).toHaveBeenCalledWith(`http://localhost/odata/Employees(3dde7303-5414-4af6-b96b-591f33d25445)`, '{}', jasmine.any(Object));
    }));

    it('Put with expand', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'put').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Put(employee, employee.EmployeeID).Expand('Boss');
        const url = operation.GetUrl();
        const result = operation.Exec();

        // Assert
        assert.equal(url, `http://localhost/odata/Employees(${employee.EmployeeID})?$expand=Boss`);
        assert.isNotNull(result);

        let httpParams: HttpParams = new HttpParams();
        httpParams = httpParams.append('$expand', 'Boss');
        expect(http.put).toHaveBeenCalledWith(`http://localhost/odata/Employees(${employee.EmployeeID})`, `{"EmployeeID":1,"FirstName":"f","LastName":"l","City":"c","BirthDate":null,"Orders":null,"Boss":null}`, jasmine.objectContaining({ params: httpParams }));
    }));

    it('Query', inject([HttpClient, ODataServiceFactory, ODataConfiguration], (http: HttpClient, factory: ODataServiceFactory, config: ODataConfiguration) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const operation = service.Query().Top(100);
        const url = operation.GetUrl();
        const result = operation.Exec();

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

        assert.equal(url, `http://localhost/odata/Employees?$top=100`);
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees`, testOptions);
    }));

    it('Query and Delete using same service', inject([HttpClient, ODataServiceFactory, ODataConfiguration], (http: HttpClient, factory: ODataServiceFactory, config: ODataConfiguration) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());
        spyOn(http, 'delete').and.returnValue(new Observable<Response>());

        // Act
        const result1 = service.Query().Top(100).Exec();
        const result2 = service.Delete('x').Exec();

        // Assert GET
        const getOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = { params: new HttpParams().append(config.keys.top, '100'), observe: 'response' };

        assert.isNotNull(result1);
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

        assert.isNotNull(result2);
        expect(http.delete).toHaveBeenCalledWith(`http://localhost/odata/Employees('x')`, deleteOptions);
    }));

    it('Custom Action string key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomAction('strKey', 'act', { 'x': 42 });

        // Assert
        assert.isNotNull(result);
        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees('strKey')/act`, `{"x":42}`, jasmine.any(Object));
    }));

    it('Custom Action number key', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomAction(118, 'act', { 'x': 42 });

        // Assert
        assert.isNotNull(result);
        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees(118)/act`, `{"x":42}`, jasmine.any(Object));
    }));

    it('Custom Collection Action', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'post').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomCollectionAction('check', { 'task': 1 });

        // Assert
        assert.isNotNull(result);
        expect(http.post).toHaveBeenCalledWith(`http://localhost/odata/Employees/check`, `{"task":1}`, jasmine.any(Object));
    }));

    it('Custom Function 1', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction(21, 'calculateLatestTimeCard');

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(21)/calculateLatestTimeCard()`, jasmine.any(Object));
    }));

    it('Custom Function 2', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction('boom', `getSalesTaxRate(area='abc', postalCode=10)`);

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees('boom')/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));

    it('Custom Function with Parameters', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomFunction(19, 'getSalesTaxRate', { area: 'abc', postalCode: 10 });

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees(19)/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));

    it('Custom Collection Function 1', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomCollectionFunction('calculateLatestTimeCard');

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/calculateLatestTimeCard()`, jasmine.any(Object));
    }));

    it('Custom Collection Function 2', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomCollectionFunction(`getSalesTaxRate(area='abc', postalCode=10)`);

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));

    it('Custom Collection Function with Parameters', inject([HttpClient, ODataServiceFactory], (http: HttpClient, factory: ODataServiceFactory) => {
        // Assign
        const service = factory.CreateService<IEmployee>('Employees');

        spyOn(http, 'get').and.returnValue(new Observable<Response>());

        // Act
        const result = service.CustomCollectionFunction('getSalesTaxRate', { area: 'abc', postalCode: 10 });

        // Assert
        assert.isNotNull(result);
        expect(http.get).toHaveBeenCalledWith(`http://localhost/odata/Employees/getSalesTaxRate(area='abc', postalCode=10)`, jasmine.any(Object));
    }));
});
