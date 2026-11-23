import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }
  userForm!: FormGroup;
  error = signal<string>("");
  isLogging = signal<boolean>(false);

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  onSubmit(): void {
    console.log("login details: ", this.userForm.value);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isLogging.set(true);
    this.authService.login(this.userForm.value).subscribe({
      next: res => {
        this.isLogging.set(false);
        this.router.navigate(['/employees']);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Login failed.Please try again.');
        this.isLogging.set(false);
      }
    })
  }
}
