import { Injectable, signal, computed } from '@angular/core';

export interface MenuItem {
  id: number;
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
  id: number;
  items: CartItem[];
  total: number;
  transactionMode: string;
  paymentMode: string;
  timestamp: Date;
}

export interface Staff {
  id: number;
  staffCode: string;
  name: string;
  role: 'Employee' | 'Admin';
  contact: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  password: string;
}

export interface KioskSettings {
  kioskName: string;
  transactionModes: string[];
  paymentModes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CartServices {

  // ── SETTINGS ──
  kioskSettings = signal<KioskSettings>({
    kioskName: 'Chut Chut',
    transactionModes: ['Dine In', 'Take Out', 'Grab'],
    paymentModes: ['Cash', 'Online Payment'],
  });

  // ── MENU ITEMS ──
  menuItems = signal<MenuItem[]>([
    { id: 1,  name: 'Wings & Rice 2pcs',                  price: 90,  category: 'Wings & Rice',   description: '2 pcs chicken wings with steamed rice',        image: 'wings-rice.jpg' },
    { id: 2,  name: 'Wings & Rice 3pcs',                  price: 110, category: 'Wings & Rice',   description: '3 pcs chicken wings with steamed rice',        image: 'wings-rice.jpg' },
    { id: 3,  name: 'Wings & Fries 2pcs',                 price: 100, category: 'Wings & Fries',  description: '2 pcs chicken wings with fries',               image: 'wingsfries.png' },
    { id: 4,  name: 'Wings & Fries 3pcs',                 price: 120, category: 'Wings & Fries',  description: '3 pcs chicken wings with fries',               image: 'wingsfries.png' },
    { id: 5,  name: 'Wings & Fries 4pcs',                 price: 125, category: 'Wings & Fries',  description: '4 pcs chicken wings with fries',               image: 'wingsfries.png' },
    { id: 6,  name: 'Wings & Fries 5pcs',                 price: 140, category: 'Wings & Fries',  description: '5 pcs chicken wings with fries',               image: 'wingsfries.png' },
    { id: 7,  name: 'Wings & Rice w/ Gravy 2pcs',         price: 80,  category: 'Wings & Gravy',  description: '2 pcs chicken wings with rice and gravy',      image: 'wings-gravy.png' },
    { id: 8,  name: 'Wings & Rice w/ Gravy 3pcs',         price: 90,  category: 'Wings & Gravy',  description: '3 pcs chicken wings with rice and gravy',      image: 'wings-gravy2.png' },
    { id: 9,  name: 'Wings & Rice w/ Drinks',             price: 175, category: 'Wings & Drinks', description: 'Chicken wings with plain rice and drinks',     image: 'wings-rice-drinks.png' },
    { id: 10, name: 'Combo 1',                            price: 180, category: 'Combos',         description: '6 pcs chicken only (2 flavor of choice)',      image: 'combo1.png' },
    { id: 11, name: 'Combo 2',                            price: 240, category: 'Combos',         description: '8 pcs chicken only (flavor of choice)',        image: 'combo2.png' },
    { id: 12, name: 'Combo 3',                            price: 154, category: 'Combos',         description: '2 pcs chicken with cheese hotdog',             image: 'combo2.png' },
    { id: 13, name: 'Fries Small',                        price: 50,  category: 'Fries',          description: 'Small fries — Cheese, Sour Cream, or BBQ',    image: 'fries.jpg' },
    { id: 14, name: 'Fries Medium',                       price: 60,  category: 'Fries',          description: 'Medium fries — Cheese, Sour Cream, or BBQ',   image: 'fries.jpg' },
    { id: 15, name: 'Fries Large',                        price: 80,  category: 'Fries',          description: 'Large fries — Cheese, Sour Cream, or BBQ',    image: 'fries.jpg' },
    { id: 16, name: 'Mozzarella Corndog',                 price: 100, category: 'Corndog',        description: 'Chut Chut style mozzarella corndog',           image: 'corndog.jpg' },
    { id: 17, name: 'Cheese Hotdog Corndog',              price: 85,  category: 'Corndog',        description: 'Chut Chut style cheese hotdog corndog',        image: 'corndog.jpg' },
    { id: 18, name: 'Cone Twirl Vanilla',                 price: 25,  category: 'Chillers',       description: 'Soft serve vanilla cone twirl',                image: 'vanilla.jpg' },
    { id: 19, name: 'Cone Twirl Chocolate',               price: 25,  category: 'Chillers',       description: 'Soft serve chocolate cone twirl',              image: 'chocolate.jpg' },
    { id: 20, name: 'Cone Twirl Mix',                     price: 25,  category: 'Chillers',       description: 'Soft serve vanilla & chocolate mix',           image: 'mix.jpg' },
    { id: 21, name: 'Strawberry Sundae',                  price: 40,  category: 'Chillers',       description: 'Creamy strawberry sundae twist',               image: 'sundaetwist.png' },
    { id: 22, name: 'Blueberry Sundae',                   price: 40,  category: 'Chillers',       description: 'Creamy blueberry sundae twist',                image: 'sundaetwist.png' },
    { id: 23, name: 'Caramel Sundae',                     price: 40,  category: 'Chillers',       description: 'Rich caramel sundae twist',                    image: 'sundaetwist.png' },
    { id: 24, name: 'Crimson Sundae',                     price: 40,  category: 'Chillers',       description: 'Crimson flavor sundae twist',                  image: 'sundaetwist.png' },
    { id: 25, name: 'Lemon Sundae',                       price: 40,  category: 'Chillers',       description: 'Refreshing lemon sundae twist',                image: 'lemonsundae.png' },
    { id: 26, name: 'Giant Twirl Chocolate',              price: 35,  category: 'Chillers',       description: 'Large chocolate soft serve cone',              image: 'giantwirl.png' },
    { id: 27, name: 'Giant Twirl Vanilla',                price: 35,  category: 'Chillers',       description: 'Large vanilla soft serve cone',                image: 'giantwirl.png' },
    { id: 28, name: 'Giant Twirl Mix',                    price: 35,  category: 'Chillers',       description: 'Large vanilla & chocolate mix cone',           image: 'giantwirl.png' },
    { id: 29, name: 'Soda Float 7UP',                     price: 50,  category: 'Chillers',       description: '7UP soda float with soft serve',               image: '7up.jpg' },
    { id: 30, name: 'Soda Float Coke',                    price: 50,  category: 'Chillers',       description: 'Coke soda float with soft serve',              image: 'coke.jpg' },
    { id: 31, name: 'Soda Float Royal',                   price: 50,  category: 'Chillers',       description: 'Royal soda float with soft serve',             image: 'royal.jpg' },
    { id: 32, name: 'Chocolate Macchiato',                price: 55,  category: 'Chillers',       description: 'Chut Chut premium chocolate macchiato',        image: 'icedcoffee.png' },
    { id: 33, name: 'Caramel Macchiato',                  price: 55,  category: 'Chillers',       description: 'Iced caramel macchiato',                       image: 'icedcoffee.png' },
    { id: 34, name: 'French Vanilla',                     price: 55,  category: 'Chillers',       description: 'Chilled iced french vanilla',                  image: 'icedcoffee.png' },
    { id: 35, name: "Sundae's Best Choco Crunkies",       price: 50,  category: 'Chillers',       description: 'Sundae overload with toppings',                image: 'choco.png' },
    { id: 36, name: "Sundae's Best Caramel Nut Crunch",   price: 50,  category: 'Chillers',       description: 'Rocky road sundae with toppings',              image: 'caramel.png' },
    { id: 37, name: "Sundae's Best Strawberry Crunch",    price: 50,  category: 'Chillers',       description: 'Graham pampig sundae with toppings',           image: 'strawberry.png' },
  ]);

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
  staffList = signal<Staff[]>([
    { id: 1, staffCode: 'EMP001', name: 'Juan Dela Cruz', role: 'Employee', contact: '09123456789', status: 'Active', dateAdded: '2026-06-01', password: 'juan2024'  },
    { id: 2, staffCode: 'EMP002', name: 'Maria Santos',   role: 'Employee', contact: '09987654321', status: 'Active', dateAdded: '2026-06-01', password: 'maria2024' },
    { id: 3, staffCode: 'ADM001', name: 'Rcp',          role: 'Admin',      contact: '',            status: 'Active', dateAdded: '2026-06-01', password: 'admin2024' },
  ]);

  // ── AUTH ──
  currentStaff = signal<Staff | null>(null);

  isLoggedIn = computed(() => this.currentStaff() !== null);
  isAdmin    = computed(() => this.currentStaff()?.role === 'Admin');

  loginStaff(staffCode: string, password: string): { success: boolean; message: string } {
    const match = this.staffList().find(
      s =>
        s.staffCode.toLowerCase() === staffCode.trim().toLowerCase() &&
        s.password === password &&
        s.status === 'Active'
    );
    if (!match) {
      return { success: false, message: 'Invalid Staff ID or password.' };
    }
    this.currentStaff.set(match);
    return { success: true, message: `Welcome, ${match.name}!` };
  }

  logoutStaff(): void {
    this.currentStaff.set(null);
    this.clearCart();
  }

  // ── CART METHODS ──
  addToCart(item: MenuItem): void {
    const current  = this.cartItems();
    const existing = current.find(entry => entry.item.id === item.id);
    if (existing) {
      this.cartItems.set(
        current.map(entry =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        )
      );
    } else {
      this.cartItems.set([...current, { item, quantity: 1 }]);
    }
  }

  removeFromCart(itemId: number): void {
    this.cartItems.set(this.cartItems().filter(entry => entry.item.id !== itemId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  placeOrder(): void {
    const newOrder: CompletedOrder = {
      id: this.completedOrders().length + 1,
      items: [...this.cartItems()],
      total: this.cartTotal(),
      transactionMode: this.transactionMode(),
      paymentMode: this.paymentMode(),
      timestamp: new Date()
    };
    this.completedOrders.set([...this.completedOrders(), newOrder]);
    this.cartItems.set([]);
  }
  
  // ── SETTINGS METHODS ──
  updateSettings(newSettings: Partial<KioskSettings>): void {
    this.kioskSettings.set({ ...this.kioskSettings(), ...newSettings });
  }

  resetDailySales(): void {
    this.completedOrders.set([]);
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
  addStaff(staff: Omit<Staff, 'id'>): void {
    const newId = Math.max(...this.staffList().map(s => s.id), 0) + 1;
    this.staffList.set([...this.staffList(), { id: newId, ...staff }]);
  }

  updateStaff(updatedStaff: Staff): void {
    this.staffList.set(
      this.staffList().map(s => s.id === updatedStaff.id ? updatedStaff : s)
    );
  }

  removeStaff(staffId: number): void {
    this.staffList.set(this.staffList().filter(s => s.id !== staffId));
  }
}