import { IEmployee } from './employee';

export class IEmployeeBuilder {
    private _employee: IEmployee;

    constructor() {
        this._employee = {
            EmployeeID: 1,
            FirstName: 'f',
            LastName: 'l',
            City: 'c',
            BirthDate: undefined,
            Orders: undefined,
            Boss: undefined
        };
    }

    public build(): IEmployee {
        return this._employee;
    }
}
