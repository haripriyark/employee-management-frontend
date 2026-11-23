import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee/employee';
import { Employee } from '../../../core/models/employee.model';
@Component({
  imports: [],
  selector: 'app-employee-details',
  styleUrl: './employee-details.css',
  templateUrl: './employee-details.html',
})
export class EmployeeDetails implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {

  }
  id: string = "";
  ngOnInit(): void {
    console.log("Empl details console");
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || "";
      // console.log(id);
      this.getEmployeeById();
    });
  }
  getEmployeeById() {
    this.employeeService.getEmployeeById(this.id).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
  goBack() {
    this.router.navigate(['/employees']);
  }
}

