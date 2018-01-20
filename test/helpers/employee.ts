import { IOrder } from './order';

export interface IEmployee {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    City: string;
    BirthDate: Date;
    Boss: IEmployee;
    Orders: IOrder[];
}
