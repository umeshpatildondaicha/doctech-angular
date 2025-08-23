import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AppInputComponent, AppButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).then((success) => {
      if (success) {
        const userType = this.authService.getUserType();
        if (userType === 'doctor') {
          this.router.navigate(['/dashboard']);
        } else if (userType === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        }
      } else {
        this.errorMessage = 'Invalid username or password';
      }
      this.isLoading = false;
    });
  }
} 