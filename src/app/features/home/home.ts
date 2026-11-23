import { Component } from '@angular/core'
import { Router, RouterLink } from '@angular/router';
import { Login } from '../../auth/login/login';

@Component({
  imports: [RouterLink, Login],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  constructor(private router: Router) {

  }
  viewEmployees() {Login
  this.router.navigate(['/employees']);
}
}
