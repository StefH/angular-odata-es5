import { Component, Injectable, OnInit } from '@angular/core';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { Observable, Operator } from 'rxjs/Rx';
import { IEmployee } from '../test/helpers/employee';
import { NorthwindODataConfigurationFactory } from './NorthwindODataConfigurationFactory';

import { ODataConfiguration, ODataServiceFactory, ODataService, ODataQuery, ODataPagedResult } from '../src/index';

console.log('`EmployeeGridODataComponent` component loaded asynchronously');

@Component({
    templateUrl: './employeeGridOData.component.html',
    selector: 'ao-employee-grid-odata',
    providers: [ { provide: ODataConfiguration, useFactory: NorthwindODataConfigurationFactory }, ODataServiceFactory ],
    styleUrls: [ './employeeGridOData.component.css']
})

export class EmployeeGridODataComponent implements OnInit {

    public employees: IEmployee[] = [];

    public totalRecords: number;

    public filter: LazyLoadEvent;

    public query: ODataQuery<IEmployee>;

    private odata: ODataService<IEmployee>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<IEmployee>('Employees');
    }

    public ngOnInit() {
        console.log('hello `EmployeeGridODataComponent` component');
    }

    public loadEmployeesLazy(event: LazyLoadEvent) {
        this.filter = event;

        this.getPagedData(event);
    }

    private getPagedData(event: LazyLoadEvent) {
        let query: ODataQuery<IEmployee> = this.odata
            .Query()
            .Expand('Orders')
            .Select(['EmployeeID', 'FirstName', 'LastName', 'BirthDate', 'City', 'Orders']);

        if (event.rows) {
            query = query.Top(event.rows);
        }

        if (event.first) {
            query = query.Skip(event.first);
        }

        if (event.filters) {
            const filterOData: string[] = [];
            for (const prop in event.filters) {
                if (event.filters.hasOwnProperty(prop)) {
                    const filter = event.filters[prop] as FilterMetadata;
                    if (filter.matchMode && filter.matchMode !== '') {
                        const params = filter.matchMode.toLowerCase().split(':');
                        const operator = params[0];

                        // http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html
                        switch (operator) {
                            case 'length':
                            case 'day':
                            case 'fractionalseconds':
                            case 'hour':
                            case 'minute':
                            case 'month':
                            case 'second':
                            case 'totaloffsetminutes':
                            case 'totalseconds':
                            case 'year':
                                filterOData.push(`${operator}(${prop}) ${params[1]} ${filter.value}`);
                                break;
                            case 'eq':
                            case 'ne':
                            case 'gt':
                            case 'ge':
                            case 'lt':
                            case 'le':
                                filterOData.push(`${prop} ${operator} ${filter.value}`);
                                break;
                            case 'contains':
                            case 'endswith':
                            case 'startswith':
                                filterOData.push(`${operator}(${prop}, '${filter.value}')`);
                                break;
                            default:
                                // no action
                        }
                    }
                 }
            }

            if (filterOData.length > 0) {
                query = query.Filter(filterOData.join(' and '));
            }
        }

        if (event.sortField) {
            const sortOrder: string = event.sortOrder && event.sortOrder > 0 ? 'asc' : 'desc';
            query = query.OrderBy(event.sortField + ' ' + sortOrder);
        }

        this.query = query;

        query
            .ExecWithCount()
            .subscribe((pagedResult: ODataPagedResult<IEmployee>) => {
                    this.employees = pagedResult.data;
                    this.totalRecords = pagedResult.count;
                },
                (error) => {
                    console.log('getPagedData ERROR ' + error);
                });
    }
}
