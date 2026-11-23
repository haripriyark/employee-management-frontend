import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { EmployeeList } from './features/employees/employee-list/employee-list';
import { EmployeeDetails } from './features/employees/employee-details/employee-details';
import { PageNotFound } from './page-not-found/page-not-found';
import { EmployeeForm } from './features/employees/employee-form/employee-form';
import { authGuard } from '../app/auth/guards/auth-guard';
import { Login } from '../app/auth/login/login';
import { guestGuard } from '../app/auth/guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'employees',
        component: EmployeeList,
        canActivate: [authGuard]
    },
    {
        path: 'employees/new',
        component: EmployeeForm,
        canActivate: [authGuard]
    },
    {
        path: 'employees/:id/edit',
        component: EmployeeForm,
        canActivate: [authGuard]
    }, {
        path: '**',
        component: PageNotFound
    }
];
