import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartServices, MenuItem, Staff, OrderHistoryDay } from '../cart-services';

@Component({
  selector: 'app-manager-panel',
  imports: [],
  templateUrl: './manager-panel.html',
  styleUrl: './manager-panel.css'
})
export class ManagerPanelComponent implements OnDestroy {
  router      = inject(Router);
  cartService = inject(CartServices);

  activeTab  = signal<string>('dashboard');
  successMsg = signal('');

  allTransactionModes = ['Dine In', 'Take Out', 'Grab'];
  allPaymentModes     = ['Cash', 'Gcash/Maya'];

  // ── PASSWORD MANAGEMENT ──
  newManagerPassword = signal('');

  // ── MENU MANAGEMENT ──
  showMenuForm  = signal(false);
  editingItem   = signal<MenuItem | null>(null);
  newItem       = signal<Partial<MenuItem>>({ name: '', price: 0, category: '', description: '', image: '' });

  // ── STAFF MANAGEMENT ──
  showStaffForm  = signal(false);
  editingStaff   = signal<Staff | null>(null);
  newStaff       = signal<Partial<Staff>>({ staffCode: '', name: '', contact: '', status: 'Active', dateAdded: '', password: '' });

  // ── SALES HISTORY — which day is expanded ──
  expandedDate = signal<string | null>(null);

  // ── SALES COMPUTED (today) ──
  itemSales = computed(() => {
    const orders = this.cartService.completedOrders();
    const map    = new Map<string, { name: string; qty: number; total: number; image: string }>();
    orders.forEach(order => {
      order.items.forEach(entry => {
        const existing = map.get(entry.item.name);
        if (existing) {
          existing.qty   += entry.quantity;
          existing.total += entry.item.price * entry.quantity;
        } else {
          map.set(entry.item.name, {
            name:  entry.item.name,
            qty:   entry.quantity,
            total: entry.item.price * entry.quantity,
            image: entry.item.image
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  });

  transactionBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
      dineIn:  orders.filter(o => o.transactionMode === 'Dine In').length,
      takeOut: orders.filter(o => o.transactionMode === 'Take Out').length,
      grab:    orders.filter(o => o.transactionMode === 'Grab').length
    };
  });

  paymentBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
      cash:   orders.filter(o => o.paymentMode === 'Cash').length,
      gcashmaya: orders.filter(o => o.paymentMode === 'Gcash/Maya').length,

    };
  });

  // ── POLLING — re-fetch today's orders AND sales history every 30s
  // to pick up employee transactions and any resets triggered from
  // the Employee Dashboard (a separate session, so this is the only
  // way this panel can find out about them). ──
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.cartService.loadMenuItems();
    this.cartService.loadStaff();
    this.cartService.loadTodayOrders();
    this.cartService.loadSettings();
    this.cartService.loadOrdersHistory(); // loads all-time history grouped by date

    this.pollInterval = setInterval(() => {
      this.cartService.loadTodayOrders();
      this.cartService.loadOrdersHistory();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

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

  saveManagerPassword(): void {
    if (!this.newManagerPassword().trim()) return;
    this.cartService.updateSettings({ managerPassword: this.newManagerPassword() });
    this.newManagerPassword.set('');
    this.showSuccess('Manager password updated!');
  }

  resetSales(): void {
    // Refresh Sales History as soon as the reset actually completes on
    // the server, instead of waiting for the next 30s poll — this only
    // helps when the Manager is the one clicking Reset; if an Employee
    // resets from their own dashboard, the poll above is what catches it.
    this.cartService.resetDailySales(() => {
      this.cartService.loadOrdersHistory();
    });
    this.showSuccess('Today\'s sales have been reset!');
  }

  showSuccess(msg: string): void {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 3000);
  }

  // ── BACKUP EXPORT ──
  exportBackup(): void {
    this.cartService.exportBackup();
  }

  // ── HISTORY ──
  toggleDay(date: string): void {
    this.expandedDate.set(this.expandedDate() === date ? null : date);
  }

  refreshHistory(): void {
    this.cartService.loadOrdersHistory();
    this.showSuccess('Sales history refreshed!');
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
    this.cartService.deleteMenuItem(itemId);
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
    this.newStaff.set({ staffCode: '', name: '', contact: '', status: 'Active', dateAdded: '', password: '' });
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
    if (!staff.staffCode || !staff.name || !staff.password) return;
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
    this.router.navigate(['/']);
  }
}