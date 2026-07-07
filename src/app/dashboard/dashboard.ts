import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { CartServices, MenuItem } from '../cart-services';
=======
import { CartServices, MenuItem, Staff } from '../cart-services';

>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
<<<<<<< HEAD
  router      = inject(Router);
=======
  router = inject(Router);
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  cartService = inject(CartServices);

  activeTab = signal<string>('sales');

  // ── ON DUTY ──
  currentStaff = computed(() => this.cartService.currentStaff());

  // ── NEW ORDER ──
<<<<<<< HEAD
  orderStep            = signal<number>(1);
  selectedTransaction  = signal<string>('');
  selectedPayment      = signal<string>('');
=======
  orderStep = signal<number>(1);
  selectedTransaction = signal<string>('');
  selectedPayment = signal<string>('');
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  categories = ['All', 'Chillers', 'Combos', 'Corndog', 'Fries', 'Wings & Drinks', 'Wings & Fries', 'Wings & Gravy', 'Wings & Rice'];
  selectedCategory = signal('All');

  filteredItems = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.cartService.menuItems();
    return this.cartService.menuItems().filter(item => item.category === cat);
  });

  // ── MENU MANAGEMENT ──
  showMenuForm = signal(false);
<<<<<<< HEAD
  editingItem  = signal<MenuItem | null>(null);
  newItem      = signal<Partial<MenuItem>>({ name: '', price: 0, category: '', description: '', image: '' });

  // ── SALES COMPUTED ──
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
=======
  editingItem = signal<MenuItem | null>(null);
  newItem = signal<Partial<MenuItem>>({ name: '', price: 0, category: '', description: '', image: '' });

  // ── STAFF MANAGEMENT ──
  showStaffForm = signal(false);
  editingStaff = signal<Staff | null>(null);
  newStaff = signal<Partial<Staff>>({ name: '', role: 'Employee', contact: '', status: 'Active', dateAdded: '' });

  // ── SALES ──
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
          // Look up the menu item to grab its image, since the order itself only stores name/price
          const menuMatch = this.cartService.menuItems().find(m => m.name === entry.name);
          map.set(entry.name, {
            name: entry.name,
            qty: entry.quantity,
            total: entry.price * entry.quantity,
            image: menuMatch?.image ?? ''
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  });

  transactionBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
<<<<<<< HEAD
      dineIn:  orders.filter(o => o.transactionMode === 'Dine In').length,
      takeOut: orders.filter(o => o.transactionMode === 'Take Out').length,
      grab:    orders.filter(o => o.transactionMode === 'Grab').length
=======
      dineIn: orders.filter(o => o.transactionMode === 'Dine In').length,
      takeOut: orders.filter(o => o.transactionMode === 'Take Out').length,
      grab: orders.filter(o => o.transactionMode === 'Grab').length
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    };
  });

  paymentBreakdown = computed(() => {
    const orders = this.cartService.completedOrders();
    return {
<<<<<<< HEAD
      cash:   orders.filter(o => o.paymentMode === 'Cash').length,
      online: orders.filter(o => o.paymentMode === 'Online Payment').length,
      grab:   orders.filter(o => o.paymentMode === 'Grab').length
    };
  });

  // ── ORDERS LIST (client-side "done" tracking — not persisted to backend) ──
  doneOrderIds = signal<Set<string>>(new Set());

  private allOrdersIndexed = computed(() =>
    this.cartService.completedOrders().map((order, i) => ({ order, index: i + 1 }))
  );

  pendingOrders = computed(() =>
    this.allOrdersIndexed().filter(entry => !this.doneOrderIds().has(entry.order._id))
  );

  doneOrders = computed(() =>
    this.allOrdersIndexed().filter(entry => this.doneOrderIds().has(entry.order._id))
  );

  markOrderDone(orderId: string): void {
    const updated = new Set(this.doneOrderIds());
    updated.add(orderId);
    this.doneOrderIds.set(updated);
  }

  undoOrderDone(orderId: string): void {
    const updated = new Set(this.doneOrderIds());
    updated.delete(orderId);
    this.doneOrderIds.set(updated);
  }

  // ── INIT ──
  constructor() {
    this.cartService.loadMenuItems();
    this.cartService.loadTodayOrders();
    this.cartService.loadSettings();
    // Note: loadStaff() removed — staff management is manager-only
  }

=======
      cash: orders.filter(o => o.paymentMode === 'Cash').length,
      online: orders.filter(o => o.paymentMode === 'Online Payment').length,
      grab: orders.filter(o => o.paymentMode === 'Grab').length
    };
  });

>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  // ── NEW ORDER METHODS ──
  selectTransaction(mode: string): void {
    this.selectedTransaction.set(mode);
    this.orderStep.set(2);
  }

  selectPayment(mode: string): void {
    this.selectedPayment.set(mode);
    this.cartService.transactionMode.set(this.selectedTransaction());
    this.cartService.paymentMode.set(mode);
    this.cartService.placeOrder();
    this.orderStep.set(3);
  }

  newOrder(): void {
    this.selectedTransaction.set('');
    this.selectedPayment.set('');
    this.orderStep.set(1);
    this.selectedCategory.set('All');
  }

  seeOrder(): void {
    this.activeTab.set('orders');
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
<<<<<<< HEAD
=======

>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
    if (this.editingItem()) {
      this.cartService.updateMenuItem({ ...this.editingItem()!, ...item } as MenuItem);
    } else {
      this.cartService.addMenuItem(item as Omit<MenuItem, '_id'>);
    }
    this.showMenuForm.set(false);
    this.editingItem.set(null);
  }

  deleteItem(itemId: string): void {
<<<<<<< HEAD
    this.cartService.deleteMenuItem(itemId);
=======
    this.cartService.removeMenuItem(itemId);
>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  }

  cancelMenuForm(): void {
    this.showMenuForm.set(false);
    this.editingItem.set(null);
  }

  updateNewItem(field: string, value: string | number): void {
    this.newItem.set({ ...this.newItem(), [field]: value });
  }

<<<<<<< HEAD
=======
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
    } else {
      this.cartService.addStaff(staff as Omit<Staff, '_id'>);
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

>>>>>>> a0648fa2714f0caf46866476b36751c14cebf75a
  logout(): void {
    this.cartService.logoutStaff();
    this.router.navigate(['/']);
  }
}