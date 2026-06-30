import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CompletedOrder {
  _id: string;
  items: {
    item: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  transactionMode: string;
  paymentMode: string;
  timestamp: string;
}

export interface Staff {
  _id: string;
  staffCode: string;
  name: string;
  role: 'Employee' | 'Admin';
  contact: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  password: string;
}

export interface KioskSettings {
  _id?: string;
  kioskName: string;
  transactionModes: string[];
  paymentModes: string[];
}

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class CartServices {

  private http = inject(HttpClient);

  // ── SETTINGS ──
  kioskSettings = signal<KioskSettings>({
    kioskName: 'Chut Chut',
    transactionModes: ['Dine In', 'Take Out', 'Grab'],
    paymentModes: ['Cash', 'Online Payment'],
  });

  // ── MENU ITEMS ──
  menuItems = signal<MenuItem[]>([]);

  // ── CART ──
  cartItems = signal<CartItem[]>([]);

  cartTotal = computed(() =>
    this.cartItems().reduce((total, entry) => total + entry.item.price * entry.quantity, 0)
  );

  cartCount = computed(() =>
    this.cartItems().reduce((count, entry) => count + entry.quantity, 0)
  );

  // ── ORDER STATE ──
  transactionMode = signal<string>('');
  paymentMode     = signal<string>('');

  // ── COMPLETED ORDERS ──
  completedOrders = signal<CompletedOrder[]>([]);

  todaySales = computed(() =>
    this.completedOrders().reduce((total, order) => total + order.total, 0)
  );

  todayOrderCount = computed(() =>
    this.completedOrders().length
  );

  // ── STAFF ──
  staffList = signal<Staff[]>([]);

  // ── AUTH ──
  currentStaff = signal<Staff | null>(null);

  isLoggedIn = computed(() => this.currentStaff() !== null);
  isAdmin    = computed(() => this.currentStaff()?.role === 'Admin');

  constructor() {
    this.loadMenuItems();
    this.loadStaff();
    this.loadOrders();
    this.loadSettings();
  }


  // ── MENU METHODS ──
    addMenuItem(item: Omit<MenuItem, '_id'>): void {
      this.http.post<MenuItem>(`${API_URL}/menu`, item).subscribe({
        next: (saved) => this.menuItems.set([...this.menuItems(), saved]),
        error: (err) => console.error('Failed to add menu item:', err)
      });
    }

    updateMenuItem(updatedItem: MenuItem): void {
      this.http.put<MenuItem>(`${API_URL}/menu/${updatedItem._id}`, updatedItem).subscribe({
        next: (saved) => {
          this.menuItems.set(
            this.menuItems().map(m => m._id === saved._id ? saved : m)
          );
        },
        error: (err) => console.error('Failed to update menu item:', err)
      });
    }

    removeMenuItem(itemId: string): void {
      this.http.delete(`${API_URL}/menu/${itemId}`).subscribe({
        next: () => this.menuItems.set(this.menuItems().filter(m => m._id !== itemId)),
        error: (err) => console.error('Failed to remove menu item:', err)
      });
    }
  loadMenuItems(): void {
    this.http.get<MenuItem[]>(`${API_URL}/menu`).subscribe({
      next: (items) => this.menuItems.set(items),
      error: (err) => console.error('Failed to load menu items:', err)
    });
  }

  loadStaff(): void {
    this.http.get<Staff[]>(`${API_URL}/staff`).subscribe({
      next: (staff) => this.staffList.set(staff),
      error: (err) => console.error('Failed to load staff:', err)
    });
  }

  loadOrders(): void {
    this.http.get<CompletedOrder[]>(`${API_URL}/orders`).subscribe({
      next: (orders) => this.completedOrders.set(orders),
      error: (err) => console.error('Failed to load orders:', err)
    });
  }

  loadSettings(): void {
    this.http.get<KioskSettings>(`${API_URL}/settings`).subscribe({
      next: (settings) => this.kioskSettings.set(settings),
      error: (err) => console.error('Failed to load settings:', err)
    });
  }

  // ── AUTH METHODS ──
  loginStaff(staffCode: string, password: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      this.http.post<{ success: boolean; message: string; staff?: Staff }>(
        `${API_URL}/staff/login`,
        { staffCode, password }
      ).subscribe({
        next: (res) => {
          if (res.success && res.staff) {
            this.currentStaff.set(res.staff);
          }
          resolve({ success: res.success, message: res.message });
        },
        error: (err) => {
          resolve({
            success: false,
            message: err.error?.message || 'Login failed. Please try again.'
          });
        }
      });
    });
  }

  logoutStaff(): void {
    this.currentStaff.set(null);
    this.clearCart();
  }

  // ── CART METHODS ──
  addToCart(item: MenuItem): void {
    const current  = this.cartItems();
    const existing = current.find(entry => entry.item._id === item._id);
    if (existing) {
      this.cartItems.set(
        current.map(entry =>
          entry.item._id === item._id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        )
      );
    } else {
      this.cartItems.set([...current, { item, quantity: 1 }]);
    }
  }

  removeFromCart(itemId: string): void {
    this.cartItems.set(this.cartItems().filter(entry => entry.item._id !== itemId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  placeOrder(): void {
    const newOrder = {
      items: this.cartItems().map(entry => ({
        item: entry.item._id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity
      })),
      total: this.cartTotal(),
      transactionMode: this.transactionMode(),
      paymentMode: this.paymentMode()
    };

    this.http.post<CompletedOrder>(`${API_URL}/orders`, newOrder).subscribe({
      next: (savedOrder) => {
        this.completedOrders.set([...this.completedOrders(), savedOrder]);
        this.cartItems.set([]);
      },
      error: (err) => console.error('Failed to place order:', err)
    });
  }

  // ── SETTINGS METHODS ──
  updateSettings(newSettings: Partial<KioskSettings>): void {
    const updated = { ...this.kioskSettings(), ...newSettings };
    this.http.put<KioskSettings>(`${API_URL}/settings`, updated).subscribe({
      next: (saved) => this.kioskSettings.set(saved),
      error: (err) => console.error('Failed to update settings:', err)
    });
  }

  resetDailySales(): void {
    this.http.delete(`${API_URL}/orders`).subscribe({
      next: () => this.completedOrders.set([]),
      error: (err) => console.error('Failed to reset orders:', err)
    });
  }

  toggleTransactionMode(mode: string): void {
    const current = this.kioskSettings().transactionModes;
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    this.updateSettings({ transactionModes: updated });
  }

  togglePaymentMode(mode: string): void {
    const current = this.kioskSettings().paymentModes;
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    this.updateSettings({ paymentModes: updated });
  }

  // ── STAFF METHODS ──
  addStaff(staff: Omit<Staff, '_id'>): void {
    this.http.post<Staff>(`${API_URL}/staff`, staff).subscribe({
      next: (saved) => this.staffList.set([...this.staffList(), saved]),
      error: (err) => console.error('Failed to add staff:', err)
    });
  }

  updateStaff(updatedStaff: Staff): void {
    this.http.put<Staff>(`${API_URL}/staff/${updatedStaff._id}`, updatedStaff).subscribe({
      next: (saved) => {
        this.staffList.set(
          this.staffList().map(s => s._id === saved._id ? saved : s)
        );
      },
      error: (err) => console.error('Failed to update staff:', err)
    });
  }

  removeStaff(staffId: string): void {
    this.http.delete(`${API_URL}/staff/${staffId}`).subscribe({
      next: () => this.staffList.set(this.staffList().filter(s => s._id !== staffId)),
      error: (err) => console.error('Failed to remove staff:', err)
    });
  }
}