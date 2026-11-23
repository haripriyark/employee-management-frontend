import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    EmployeeListResponse, EmployeeApiResponse
} from '../../models/employee-response.model';
import { Employee } from '../../models/employee.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) {

    }
    private apiUrl = `${environment.apiUrl}/employees`;
    getAllEmployees(page: number, limit: number, search: string = '', department: string = '', sort:string): Observable<EmployeeListResponse> {
        let params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
            .set('sort', sort)
        if (search) {
            params = params.set('search', search);
        }
        if (department) {
            params = params.set('department', department);
        }

        return this.http.get<EmployeeListResponse>(this.apiUrl, { params });
    }
    getEmployeeById(id: string): Observable<EmployeeApiResponse> {
        return this.http.get<EmployeeApiResponse>(`${this.apiUrl}/${id}`);
    }
    createEmployee(employeeData: Employee): Observable<EmployeeApiResponse> {
        return this.http.post<EmployeeApiResponse>(this.apiUrl, employeeData);
    }
    updateEmployee(id: string, employeeData: Employee): Observable<EmployeeApiResponse> {
        return this.http.put<EmployeeApiResponse>(`${this.apiUrl}/${id}`, employeeData);
    }
    deleteEmployee(id: string): Observable<EmployeeApiResponse> {
        return this.http.delete<EmployeeApiResponse>(`${this.apiUrl}/${id}`);
    }

}