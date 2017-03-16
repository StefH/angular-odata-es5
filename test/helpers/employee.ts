import { IOrder } from './order';

export interface IEmployee {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    BirthDate: Date;
    Orders: IOrder[];
}
