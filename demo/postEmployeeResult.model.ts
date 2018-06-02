import { IEmployee } from "../test/helpers/employee";
import { IOrder } from "../test/helpers/order";

export interface PostEmployeeResult extends IEmployee {
    Headers: string[];
}