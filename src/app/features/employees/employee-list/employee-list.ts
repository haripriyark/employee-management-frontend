import { Component, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { EmployeeService } from '../../../core/services/employee/employee';
import { Employee } from '../../../core/models/employee.model';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-employee-list',
  styleUrl: './employee-list.css',
  templateUrl: './employee-list.html',
})

export class EmployeeList implements OnInit {
  constructor(private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  employees = signal<Employee[]>([]);
  loading = signal<boolean>(true);
  isDeleting = signal<boolean>(false);
  successMessage = signal<string>("");
  errorMessage = signal<string>("");
  emptyMessage = signal<string>("");
  totalEmployees = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(1);
  limit: number = 5;
  searchTerm: string = "";
  department: string = "";
  departments: string[] = [
    'HR',
    'IT',
    'Sales',
    'Support'
  ];
  sort: string = "-createdAt,_id";
  sortOptions = [
    { label: 'Newest First', value: '-createdAt,_id' },
    { label: 'Oldest First', value: 'createdAt,_id' },
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: '-name' },
    { label: 'Salary (Low → High)', value: 'salary' },
    { label: 'Salary (High → Low)', value: '-salary' }
  ];
  ngOnInit(): void {
    this.loadEmployees();
  }
  private loadEmployees(): void {
    this.prepareStates();
    const term = this.searchTerm.trim();
    this.employeeService.getAllEmployees(this.currentPage(), this.limit, term, this.department, this.sort).subscribe({
      next: res => {
        this.employees.set(res.employees);
        if (res.employees.length === 0) {
          this.emptyMessage.set(
            term ?
              `No employees found for ${term} in ${this.department}` :
              `No employees found`)
        }
        this.totalEmployees.set(res.totalEmployees);
        this.totalPages.set(res.totalPages);
        this.currentPage.set(res.currentPage);
        this.loading.set(false);
      },
      error: err => {
        this.errorMessage.set(err.error.message ?? 'Unable to load employees');
        this.loading.set(false);
      }
    })
  }
  nextPage() {
    this.clearMessages();
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.loadEmployees();
    }
  }
  previousPage() {
    this.clearMessages();
    if (this.currentPage() !== 1) {
      this.currentPage.update(page => page - 1);
      this.loadEmployees();
    }
  }
  viewEmployee(id: string) {
    this.router.navigate(["/employee", id]);
  }
  addEmployee() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  editEmployee(id: string) {
    this.router.navigate([`${id}/edit`], { relativeTo: this.route });
  }
  deleteEmployee(id: string) {
    this.clearMessages();
    if (!confirm("Are you sure you want to delete?")) {
      return;
    }
    this.isDeleting.set(true);
    this.employeeService.deleteEmployee(id).subscribe({
      next: res => {
        this.successMessage.set(res.message);
        this.isDeleting.set(false);
        const isLastEmployeeOnPage = this.employees().length === 1 && this.currentPage() > 1
        if (isLastEmployeeOnPage) {
          this.currentPage.update(page => page - 1);
        }
        this.loadEmployees();
      },
      error: err => {
        this.errorMessage.set(err.error?.message ??
          "Unable to delete employee.");
        this.isDeleting.set(false);
      }
    })
  }
  searchEmployee() {
    this.clearMessages();
    this.currentPage.set(1);
    this.loadEmployees();
  }
  clearSearch() {
    this.clearMessages();
    this.searchTerm = "";
    this.currentPage.set(1);
    this.loadEmployees();
  }
  reset() {
    this.clearMessages();
    this.searchTerm = "";
    this.currentPage.set(1);
    this.department = "";
    this.sort = "-createdAt,_id";
    this.loadEmployees();
  }
  filterEmployees() {
    this.clearMessages();
    this.currentPage.set(1);
    this.loadEmployees();
  }
  sortEmployees() {
    console.log(" sort :::: ", this.sort);
    this.currentPage.set(1);
    this.loadEmployees();
  }
  private prepareStates() {
    this.loading.set(true);
  }
  private clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.emptyMessage.set('');
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }, error: err => {
        this.authService.forceLogout();
        this.router.navigate(['/login']);
      }
    })
  }
}
