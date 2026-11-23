import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee/employee';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-employee-form',
  styleUrl: './employee-form.css',
  templateUrl: './employee-form.html',
})
export class EmployeeForm implements OnInit {
  departmentOptions: string[] = ['HR', 'IT', 'Sales', 'Support'];
  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {

  }
  employeeForm!: FormGroup;
  error = signal<string>("");
  isSaving = signal<boolean>(false);
  success = signal<boolean>(false);
  employeeId: string = "";
  isEditMode = signal<boolean>(false);
  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(10000), Validators.max(500000)]],
      experience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      location: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId = id;
        this.isEditMode.set(true);
        this.employeeForm.get('email')?.disable();
        this.loadEmployeeForEdit();
      }
    })
  }
  onSubmit() {
    if (this.isEditMode()) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }
  loadEmployeeForEdit() {
    this.error.set('');
    this.success.set(false);
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: res => {
        this.employeeForm.patchValue(res.employee);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Unable to load employee.');
      }
    })
  }

  createEmployee() {
    if (this.isSaving()) {
      return;
    }
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.prepareStates();
    this.employeeService.createEmployee(this.employeeForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['..'], { relativeTo: this.route });
        }, 2000)
      },
      error: err => {
        this.isSaving.set(false);
        this.error.set(err.error?.message ?? 'Unable to create employee.');
      }
    });
  }
  updateEmployee() {
    if (this.isSaving()) {
      return;
    }
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.prepareStates();
    this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['..'], { relativeTo: this.route });
        }, 2000)
      },
      error: err => {
        this.isSaving.set(false);
        this.error.set(err.error?.message ?? 'Unable to update employee.');
      }
    })
  }
  private prepareStates() {
    this.error.set('');
    this.isSaving.set(true);
    this.success.set(false);
  }
}


