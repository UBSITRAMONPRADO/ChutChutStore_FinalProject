import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { CartServices, Staff } from '../cart-services';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cartService = inject(CartServices);
  private api = 'http://localhost:3000/api';

  staffCode = signal('');
  password = signal('');
  error = signal('');

  login(): void {
    this.error.set('');
    const code = this.staffCode().trim();
    const pass = this.password();

    if (!pass) {
      this.error.set('Please enter your password.');
      return;
    }

    if (!code) {
      // No staff code entered → attempt Manager login
      this.http.post<{ success: boolean; role: string; message?: string }>(
        `${this.api}/login/manager`,
        { password: pass }
      ).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/manager-panel']);
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Incorrect manager password');
        }
      });
    } else {
      // Staff code entered → attempt Employee login
      this.http.post<{ success: boolean; role: string; staff?: Staff; message?: string }>(
        `${this.api}/login/staff`,
        { staffCode: code, password: pass }
      ).subscribe({
        next: (res) => {
          if (res.success && res.staff) {
            this.cartService.setCurrentStaff(res.staff);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Incorrect staff code or password');
        }
      });
    }
  }
}
=======
import { CommonModule } from '@angular/common';
import { CartServices } from '../cart-services';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {

  protected cartService: CartServices = inject(CartServices);
  private router        = inject(Router);

  staffId  = signal('');
  password = signal('');
  error    = signal('');

  async login(): Promise<void> {
    this.error.set('');
  
    if (!this.staffId().trim()) {
      this.error.set('Please enter your Staff ID.');
      return;
    }
    if (!this.password()) {
      this.error.set('Please enter your password.');
      return;
    }
  
    const result = await this.cartService.loginStaff(this.staffId(), this.password());
  
    if (!result.success) {
      this.error.set(result.message);
      return;
    }
  
    this.cartService.isAdmin()
      ? this.router.navigate(['/admin'])
      : this.router.navigate(['/dashboard']);
  }
}
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
