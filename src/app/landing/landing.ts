import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
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
