import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CartServices, MenuItem, Staff } from '../cart-services';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent {
  router = inject(Router);
  cartService = inject(CartServices);

  activeTab = signal<string>('dashboard');
  successMsg = signal('');

  allTransactionModes = ['Dine In', 'Take Out', 'Grab'];
  allPaymentModes = ['Cash', 'Online Payment', 'Grab'];

  // ── PASSWORD MANAGEMENT ──
  newEmployeePassword = signal('');
  newAdminPassword = signal('');

  // ── MENU MANAGEMENT ──
  showMenuForm = signal(false);
  editingItem = signal<MenuItem | null>(null);
  newItem = signal<Partial<MenuItem>>({ name: '', price: 0, category: '', description: '', image: '' });

  // ── STAFF MANAGEMENT ──
  showStaffForm = signal(false);
  editingStaff = signal<Staff | null>(null);
  newStaff = signal<Partial<Staff>>({ name: '', role: 'Employee', contact: '', status: 'Active', dateAdded: '' });

  // ── SALES COMPUTED ──
  itemSales = computed(() => {
    const orders = this.cartService.completedOrders();
    const map = new Map<string, { name: string; qty: number; total: number; image: string }>();
    orders.forEach(order => {
      order.items.forEach(entry => {
        const existing = map.get(entry.name);
        if (existing) {
          existing.qty += entry.quantity;
          existing.total += entry.price * entry.quantity;
        } else {
          const menuMatch = this.cartService.menuItems().find(m => m.name === entry.name);
          map.set(entry.name, {
            name: entry.name,
            qty: entry.quantity,
            total: entry.price * entry.quantity,
            image: menuMatch?.image ?? ''
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  });

  transactionBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
      dineIn: orders.filter(o => o.transactionMode === 'Dine In').length,
      takeOut: orders.filter(o => o.transactionMode === 'Take Out').length,
      grab: orders.filter(o => o.transactionMode === 'Grab').length
    };
  });

  paymentBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
      cash: orders.filter(o => o.paymentMode === 'Cash').length,
      online: orders.filter(o => o.paymentMode === 'Online Payment').length,
      grab: orders.filter(o => o.paymentMode === 'Grab').length
    };
  });

  // ── SETTINGS METHODS ──
  isTransactionEnabled(mode: string): boolean {
    return this.cartService.kioskSettings().transactionModes.includes(mode);
  }

  isPaymentEnabled(mode: string): boolean {
    return this.cartService.kioskSettings().paymentModes.includes(mode);
  }

  toggleTransaction(mode: string): void {
    this.cartService.toggleTransactionMode(mode);
    this.showSuccess(`Transaction mode "${mode}" updated!`);
  }

  togglePayment(mode: string): void {
    this.cartService.togglePaymentMode(mode);
    this.showSuccess(`Payment mode "${mode}" updated!`);
  }

  saveEmployeePassword(): void {
    if (!this.newEmployeePassword().trim()) return;
    this.newAdminPassword.set('');
    this.showSuccess('Admin password updated!');
  }

  resetSales(): void {
    this.cartService.resetDailySales();
    this.showSuccess('Daily sales have been reset!');
  }

  showSuccess(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 3000);
  }

  // ── MENU METHODS ──
  startAddItem(): void {
    this.newItem.set({ name: '', price: 0, category: '', description: '', image: '' });
    this.editingItem.set(null);
    this.showMenuForm.set(true);
  }

  startEditItem(item: MenuItem): void {
    this.editingItem.set(item);
    this.newItem.set({ ...item });
    this.showMenuForm.set(true);
  }

  saveItem(): void {
    const item = this.newItem();
    if (!item.name || !item.price || !item.category) return;

    if (this.editingItem()) {
      this.cartService.updateMenuItem({ ...this.editingItem()!, ...item } as MenuItem);
      this.showSuccess('Item updated!');
    } else {
      this.cartService.addMenuItem(item as Omit<MenuItem, '_id'>);
      this.showSuccess('Item added!');
    }
    this.showMenuForm.set(false);
    this.editingItem.set(null);
  }

  deleteItem(itemId: string): void {
    this.cartService.removeMenuItem(itemId);
    this.showSuccess('Item deleted!');
  }

  cancelMenuForm(): void {
    this.showMenuForm.set(false);
    this.editingItem.set(null);
  }

  updateNewItem(field: string, value: string | number): void {
    this.newItem.set({ ...this.newItem(), [field]: value });
  }

  // ── STAFF METHODS ──
  startAddStaff(): void {
    this.newStaff.set({ name: '', role: 'Employee', contact: '', status: 'Active', dateAdded: '' });
    this.editingStaff.set(null);
    this.showStaffForm.set(true);
  }

  startEditStaff(staff: Staff): void {
    this.editingStaff.set(staff);
    this.newStaff.set({ ...staff });
    this.showStaffForm.set(true);
  }

  saveStaff(): void {
    const staff = this.newStaff();
    if (!staff.name || !staff.contact) return;
    if (this.editingStaff()) {
      this.cartService.updateStaff({ ...this.editingStaff()!, ...staff } as Staff);
      this.showSuccess('Staff updated!');
    } else {
      this.cartService.addStaff(staff as Omit<Staff, '_id'>);
      this.showSuccess('Staff added!');
    }
    this.showStaffForm.set(false);
    this.editingStaff.set(null);
  }

  cancelStaffForm(): void {
    this.showStaffForm.set(false);
    this.editingStaff.set(null);
  }

  updateNewStaff(field: string, value: string): void {
    this.newStaff.set({ ...this.newStaff(), [field]: value });
  }

  logout(): void {
    this.cartService.logoutStaff();
    this.router.navigate(['/']);
  }
}