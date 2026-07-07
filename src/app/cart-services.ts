import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import * as XLSX from 'xlsx';
=======
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a

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
<<<<<<< HEAD
  items: CartItem[];
  total: number;
  transactionMode: string;
  paymentMode: string;
  timestamp: Date;
=======
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
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
}

export interface Staff {
  _id: string;
  staffCode: string;
  name: string;
<<<<<<< HEAD
=======
  role: 'Employee' | 'Admin';
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
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
<<<<<<< HEAD
  managerPassword: string;
}

// One entry per day returned by GET /api/orders/history
// Computed live from raw orders grouped by PH timezone date
export interface OrderHistoryDay {
  date: string;                 // "YYYY-MM-DD"
  totalSales: number;
  totalOrders: number;
  transactions: { dineIn: number; takeOut: number; grab: number };
  payments:     { cash: number; online: number; grab: number };
  topItems:     { name: string; qty: number; total: number }[];
  orders:       CompletedOrder[]; // individual orders for that day
}

// Shape returned by GET /api/backup
export interface BackupPayload {
  orderRows:        Record<string, any>[];
  dailySummaryRows: Record<string, any>[];
  menuRows:         Record<string, any>[];
  staffRows:        Record<string, any>[];
}
=======
}

const API_URL = 'http://localhost:3000/api';
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a

@Injectable({
  providedIn: 'root'
})
export class CartServices {

  private http = inject(HttpClient);
<<<<<<< HEAD
  private api = 'http://localhost:3000/api';
=======
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a

  // ── SETTINGS ──
  kioskSettings = signal<KioskSettings>({
    kioskName: 'Chut Chut',
    transactionModes: ['Dine In', 'Take Out', 'Grab'],
<<<<<<< HEAD
    paymentModes: ['Cash', 'Online Payment', 'Grab'],
    managerPassword: 'admin2024'
=======
    paymentModes: ['Cash', 'Online Payment'],
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  });

  // ── MENU ITEMS ──
  menuItems = signal<MenuItem[]>([]);

  // ── CART ──
  cartItems = signal<CartItem[]>([]);

  cartTotal = computed(() =>
<<<<<<< HEAD
    this.cartItems().reduce((sum, e) => sum + e.item.price * e.quantity, 0)
  );

  cartCount = computed(() =>
    this.cartItems().reduce((sum, e) => sum + e.quantity, 0)
=======
    this.cartItems().reduce((total, entry) => total + entry.item.price * entry.quantity, 0)
  );

  cartCount = computed(() =>
    this.cartItems().reduce((count, entry) => count + entry.quantity, 0)
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  );

  // ── ORDER STATE ──
  transactionMode = signal<string>('');
  paymentMode     = signal<string>('');

<<<<<<< HEAD
  // ── TODAY'S COMPLETED ORDERS ──
  completedOrders = signal<CompletedOrder[]>([]);

  todaySales = computed(() =>
    this.completedOrders().reduce((sum, o) => sum + o.total, 0)
  );

  todayOrderCount = computed(() => this.completedOrders().length);

  // ── STAFF ──
  staffList    = signal<Staff[]>([]);
  currentStaff = signal<Staff | null>(null);

  // ── SALES HISTORY (all past days, computed live from DB orders) ──
  salesHistory = signal<OrderHistoryDay[]>([]);

  // ── EXPORT STATE ──
  exportLoading = signal<boolean>(false);

  // ══════════════════════════════════════════
  //  LOAD FROM DB
  // ══════════════════════════════════════════

  loadMenuItems(): void {
    this.http.get<MenuItem[]>(`${this.api}/menu`).subscribe(items => {
      this.menuItems.set(items);
=======
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
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    });
  }

  loadStaff(): void {
<<<<<<< HEAD
    this.http.get<Staff[]>(`${this.api}/staff`).subscribe(staff => {
      this.staffList.set(staff);
    });
  }

  loadTodayOrders(): void {
    this.http.get<CompletedOrder[]>(`${this.api}/orders/today`).subscribe(orders => {
      this.completedOrders.set(orders);
=======
    this.http.get<Staff[]>(`${API_URL}/staff`).subscribe({
      next: (staff) => this.staffList.set(staff),
      error: (err) => console.error('Failed to load staff:', err)
    });
  }

  loadOrders(): void {
    this.http.get<CompletedOrder[]>(`${API_URL}/orders`).subscribe({
      next: (orders) => this.completedOrders.set(orders),
      error: (err) => console.error('Failed to load orders:', err)
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    });
  }

  loadSettings(): void {
<<<<<<< HEAD
    this.http.get<KioskSettings>(`${this.api}/settings`).subscribe(settings => {
      this.kioskSettings.set(settings);
    });
  }

  // Fetches all orders from DB grouped by date — powers the Sales History tab
  loadOrdersHistory(): void {
    this.http.get<OrderHistoryDay[]>(`${this.api}/orders/history`).subscribe(history => {
      this.salesHistory.set(history);
    });
  }

  // ══════════════════════════════════════════
  //  CART METHODS
  // ══════════════════════════════════════════

  addToCart(item: MenuItem): void {
    const current  = this.cartItems();
    const existing = current.find(e => e.item._id === item._id);
    if (existing) {
      this.cartItems.set(
        current.map(e => e.item._id === item._id
          ? { ...e, quantity: e.quantity + 1 }
          : e
=======
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
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
        )
      );
    } else {
      this.cartItems.set([...current, { item, quantity: 1 }]);
    }
  }

  removeFromCart(itemId: string): void {
<<<<<<< HEAD
    this.cartItems.set(this.cartItems().filter(e => e.item._id !== itemId));
=======
    this.cartItems.set(this.cartItems().filter(entry => entry.item._id !== itemId));
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

<<<<<<< HEAD
  // ══════════════════════════════════════════
  //  ORDER METHODS
  // ══════════════════════════════════════════

  placeOrder(): void {
    const order = {
      items:           this.cartItems(),
      total:           this.cartTotal(),
      transactionMode: this.transactionMode(),
      paymentMode:     this.paymentMode(),
      timestamp:       new Date()
    };
    this.http.post<CompletedOrder>(`${this.api}/orders`, order).subscribe(saved => {
      this.completedOrders.set([...this.completedOrders(), saved]);
      this.clearCart();
    });
  }

  // Clears today's orders only — past days remain in DB
  resetDailySales(onComplete?: () => void): void {
    this.http.delete(`${this.api}/orders/reset`).subscribe(() => {
      this.completedOrders.set([]);
      if (onComplete) onComplete();
    });
  }
  // ══════════════════════════════════════════
  //  MENU ITEM METHODS
  // ══════════════════════════════════════════

  addMenuItem(item: Omit<MenuItem, '_id'>): void {
    this.http.post<MenuItem>(`${this.api}/menu`, item).subscribe(saved => {
      this.menuItems.set([...this.menuItems(), saved]);
    });
  }

  updateMenuItem(item: MenuItem): void {
    this.http.put<MenuItem>(`${this.api}/menu/${item._id}`, item).subscribe(updated => {
      this.menuItems.set(this.menuItems().map(m => m._id === updated._id ? updated : m));
    });
  }

  deleteMenuItem(itemId: string): void {
    this.http.delete(`${this.api}/menu/${itemId}`).subscribe(() => {
      this.menuItems.set(this.menuItems().filter(m => m._id !== itemId));
    });
  }

  // ══════════════════════════════════════════
  //  SETTINGS METHODS
  // ══════════════════════════════════════════

  updateSettings(newSettings: Partial<KioskSettings>): void {
    const merged = { ...this.kioskSettings(), ...newSettings };
    this.http.put<KioskSettings>(`${this.api}/settings`, merged).subscribe(saved => {
      this.kioskSettings.set(saved);
=======
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
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
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

<<<<<<< HEAD
  // ══════════════════════════════════════════
  //  STAFF METHODS
  // ══════════════════════════════════════════

  addStaff(staff: Omit<Staff, '_id'>): void {
    this.http.post<Staff>(`${this.api}/staff`, staff).subscribe(saved => {
      this.staffList.set([...this.staffList(), saved]);
    });
  }

  updateStaff(staff: Staff): void {
    this.http.put<Staff>(`${this.api}/staff/${staff._id}`, staff).subscribe(saved => {
      this.staffList.set(this.staffList().map(s => s._id === saved._id ? saved : s));
=======
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
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    });
  }

  removeStaff(staffId: string): void {
<<<<<<< HEAD
    this.http.delete(`${this.api}/staff/${staffId}`).subscribe(() => {
      this.staffList.set(this.staffList().filter(s => s._id !== staffId));
    });
  }


  //  SESSION METHODS
  setCurrentStaff(staff: Staff): void {
    this.currentStaff.set(staff);
  }

  logoutStaff(): void {
    this.currentStaff.set(null);
  }

  //  BACKUP EXPORT 
  //  Fetches all data, builds a 4-sheet Exce

  exportBackup(): void {
    this.exportLoading.set(true);

    this.http.get<BackupPayload>(`${this.api}/backup`).subscribe({
      next: (data) => {
        const wb = XLSX.utils.book_new();

        // Sheet 1 — Daily Summary (first so it opens by default)
        const wsSummary = XLSX.utils.json_to_sheet(data.dailySummaryRows);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Daily Summary');

        // Sheet 2 — All Orders (flat, one row per item)
        const wsOrders = XLSX.utils.json_to_sheet(data.orderRows);
        XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders');

        // Sheet 3 — Menu Items
        const wsMenu = XLSX.utils.json_to_sheet(data.menuRows);
        XLSX.utils.book_append_sheet(wb, wsMenu, 'Menu Items');

        // Sheet 4 — Staff
        const wsStaff = XLSX.utils.json_to_sheet(data.staffRows);
        XLSX.utils.book_append_sheet(wb, wsStaff, 'Staff');

        // Generate filename with today's date
        const today = new Date().toLocaleDateString('en-CA');
        XLSX.writeFile(wb, `ChutChut_Backup_${today}.xlsx`);

        this.exportLoading.set(false);
      },
      error: (err) => {
        console.error('Backup export failed:', err);
        this.exportLoading.set(false);
      }
=======
    this.http.delete(`${API_URL}/staff/${staffId}`).subscribe({
      next: () => this.staffList.set(this.staffList().filter(s => s._id !== staffId)),
      error: (err) => console.error('Failed to remove staff:', err)
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    });
  }
}