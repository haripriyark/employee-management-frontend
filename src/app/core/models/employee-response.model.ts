import { Employee } from "./employee.model";
export interface EmployeeListResponse  {
    totalEmployees: number;
    currentPage: number;
    totalPages: number;
    employees: Employee[];
}
export interface EmployeeApiResponse  {
    employee: Employee;
    message: string;
    success: boolean;
}
