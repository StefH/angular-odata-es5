import { HttpResponse } from '@angular/common/http';
import { IODataResponseModel } from '../../src/index';
import { IEmployee } from './employee';

export class HttpResponseIEmployeeBuilder {
    private readonly body: IODataResponseModel<IEmployee>;
    private httpStatus: number;

    constructor() {
        this.body = {
            '@odata.context': 'http://test.org/odata/$metadata#Employees(EmployeeID,FirstName,LastName,BirthDate,City,Orders)',
            '@odata.count': 2,
            value: [
                {
                    EmployeeID: 1,
                    FirstName: 'Nancy',
                    LastName: 'Davolio',
                    BirthDate: new Date('1948-12-08T00:00:00Z'),
                    City: 'Seattle',
                    Orders: [],
                    Boss: null
                },
                {
                    EmployeeID: 2,
                    FirstName: 'X',
                    LastName: 'Y',
                    BirthDate: new Date('1978-12-08T00:00:00Z'),
                    City: 'Paris',
                    Orders: [],
                    Boss: null
                }
            ]
        };

        this.httpStatus = 200;
    }

    public withODataCount(count: number | any): HttpResponseIEmployeeBuilder {
        this.body['@odata.count'] = count;
        return this;
    }

    public removeODataCount(): HttpResponseIEmployeeBuilder {
        delete this.body['@odata.count'];
        return this;
    }

    public withODataNextLink(link: string): HttpResponseIEmployeeBuilder {
        this.body['@odata.nextLink'] = link;
        return this;
    }

    public withHttpStatuscode(status: number): HttpResponseIEmployeeBuilder {
        this.httpStatus = status;
        return this;
    }

    public build(): HttpResponse<IODataResponseModel<IEmployee>> {
        return new HttpResponse<IODataResponseModel<IEmployee>>({
            body: this.body,
            status: this.httpStatus
        });
    }
}
