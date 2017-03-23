import { Component, Injectable, OnInit } from '@angular/core';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { Observable, Operator } from 'rxjs/rx';
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

    private odata: ODataService<IEmployee>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<IEmployee>('Employees');
    }

    public ngOnInit() {
        console.log('hello `EmployeeGridODataComponent` component');
    }

    public loadEmployeesLazy(event: LazyLoadEvent) {
        console.log('event = ' + JSON.stringify(event));
        this.filter = event;

        this.getPagedData(event);
    }

    private getPagedData(event: LazyLoadEvent) {
        let query: ODataQuery<IEmployee> = this.odata
            .Query()
            // .Expand('Orders')
            .Select(['EmployeeID', 'FirstName', 'LastName', 'BirthDate'])
            .Top(event.rows)
            .Skip(event.first);

        if (event.filters) {
            const filterOData: string[] = [];
            for (const prop in event.filters) {
                if (event.filters.hasOwnProperty(prop)) {
                    const filter = event.filters[prop] as FilterMetadata;
                    const key: string = filter.matchMode.toLowerCase();
                    if (key !== '') {
                        filterOData.push(key + '(' + prop + ', \'' + filter.value + '\')');
                    }
                 }
            }

            query = query.Filter(filterOData.join(' and '));
        }

        if (event.sortField) {
            const sortOrder: string = event.sortOrder > 0 ? 'asc' : 'desc';
            query = query.OrderBy(event.sortField + ' ' + sortOrder);
        }

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
