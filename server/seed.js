require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String
}));

const Staff = mongoose.model('Staff', new mongoose.Schema({
  staffCode: String,
  name: String,
  role: { type: String, enum: ['Employee', 'Admin'], default: 'Employee' },
  contact: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  dateAdded: String,
  password: String
}));

const Settings = mongoose.model('Settings', new mongoose.Schema({
  kioskName: { type: String, default: 'Chut Chut' },
  transactionModes: { type: [String], default: ['Dine In', 'Take Out', 'Grab'] },
  paymentModes: { type: [String], default: ['Cash', 'Online Payment'] }
}));

const menuItems = [
  { name: 'Wings & Rice 2pcs', price: 90, category: 'Wings & Rice', description: '2 pcs chicken wings with steamed rice', image: 'wings-rice.jpg' },
  { name: 'Wings & Rice 3pcs', price: 110, category: 'Wings & Rice', description: '3 pcs chicken wings with steamed rice', image: 'wings-rice.jpg' },
  { name: 'Wings & Fries 2pcs', price: 100, category: 'Wings & Fries', description: '2 pcs chicken wings with fries', image: 'wingsfries.png' },
  { name: 'Wings & Fries 3pcs', price: 120, category: 'Wings & Fries', description: '3 pcs chicken wings with fries', image: 'wingsfries.png' },
  { name: 'Wings & Fries 4pcs', price: 125, category: 'Wings & Fries', description: '4 pcs chicken wings with fries', image: 'wingsfries.png' },
  { name: 'Wings & Fries 5pcs', price: 140, category: 'Wings & Fries', description: '5 pcs chicken wings with fries', image: 'wingsfries.png' },
  { name: 'Wings & Rice w/ Gravy 2pcs', price: 80, category: 'Wings & Gravy', description: '2 pcs chicken wings with rice and gravy', image: 'wings-gravy.png' },
  { name: 'Wings & Rice w/ Gravy 3pcs', price: 90, category: 'Wings & Gravy', description: '3 pcs chicken wings with rice and gravy', image: 'wings-gravy2.png' },
  { name: 'Wings & Rice w/ Drinks', price: 175, category: 'Wings & Drinks', description: 'Chicken wings with plain rice and drinks', image: 'wings-rice-drinks.png' },
  { name: 'Combo 1', price: 180, category: 'Combos', description: '6 pcs chicken only (2 flavor of choice)', image: 'combo1.png' },
  { name: 'Combo 2', price: 240, category: 'Combos', description: '8 pcs chicken only (flavor of choice)', image: 'combo2.png' },
  { name: 'Combo 3', price: 154, category: 'Combos', description: '2 pcs chicken with cheese hotdog', image: 'combo2.png' },
  { name: 'Fries Small', price: 50, category: 'Fries', description: 'Small fries — Cheese, Sour Cream, or BBQ', image: 'fries.jpg' },
  { name: 'Fries Medium', price: 60, category: 'Fries', description: 'Medium fries — Cheese, Sour Cream, or BBQ', image: 'fries.jpg' },
  { name: 'Fries Large', price: 80, category: 'Fries', description: 'Large fries — Cheese, Sour Cream, or BBQ', image: 'fries.jpg' },
  { name: 'Mozzarella Corndog', price: 100, category: 'Corndog', description: 'Chut Chut style mozzarella corndog', image: 'corndog.jpg' },
  { name: 'Cheese Hotdog Corndog', price: 85, category: 'Corndog', description: 'Chut Chut style cheese hotdog corndog', image: 'corndog.jpg' },
  { name: 'Cone Twirl Vanilla', price: 25, category: 'Chillers', description: 'Soft serve vanilla cone twirl', image: 'vanilla.jpg' },
  { name: 'Cone Twirl Chocolate', price: 25, category: 'Chillers', description: 'Soft serve chocolate cone twirl', image: 'chocolate.jpg' },
  { name: 'Cone Twirl Mix', price: 25, category: 'Chillers', description: 'Soft serve vanilla & chocolate mix', image: 'mix.jpg' },
  { name: 'Strawberry Sundae', price: 40, category: 'Chillers', description: 'Creamy strawberry sundae twist', image: 'sundaetwist.png' },
  { name: 'Blueberry Sundae', price: 40, category: 'Chillers', description: 'Creamy blueberry sundae twist', image: 'sundaetwist.png' },
  { name: 'Caramel Sundae', price: 40, category: 'Chillers', description: 'Rich caramel sundae twist', image: 'sundaetwist.png' },
  { name: 'Crimson Sundae', price: 40, category: 'Chillers', description: 'Crimson flavor sundae twist', image: 'sundaetwist.png' },
  { name: 'Lemon Sundae', price: 40, category: 'Chillers', description: 'Refreshing lemon sundae twist', image: 'lemonsundae.png' },
  { name: 'Giant Twirl Chocolate', price: 35, category: 'Chillers', description: 'Large chocolate soft serve cone', image: 'giantwirl.png' },
  { name: 'Giant Twirl Vanilla', price: 35, category: 'Chillers', description: 'Large vanilla soft serve cone', image: 'giantwirl.png' },
  { name: 'Giant Twirl Mix', price: 35, category: 'Chillers', description: 'Large vanilla & chocolate mix cone', image: 'giantwirl.png' },
  { name: 'Soda Float 7UP', price: 50, category: 'Chillers', description: '7UP soda float with soft serve', image: '7up.jpg' },
  { name: 'Soda Float Coke', price: 50, category: 'Chillers', description: 'Coke soda float with soft serve', image: 'coke.jpg' },
  { name: 'Soda Float Royal', price: 50, category: 'Chillers', description: 'Royal soda float with soft serve', image: 'royal.jpg' },
  { name: 'Chocolate Macchiato', price: 55, category: 'Chillers', description: 'Chut Chut premium chocolate macchiato', image: 'icedcoffee.png' },
  { name: 'Caramel Macchiato', price: 55, category: 'Chillers', description: 'Iced caramel macchiato', image: 'icedcoffee.png' },
  { name: 'French Vanilla', price: 55, category: 'Chillers', description: 'Chilled iced french vanilla', image: 'icedcoffee.png' },
  { name: "Sundae's Best Choco Crunkies", price: 50, category: 'Chillers', description: 'Sundae overload with toppings', image: 'choco.png' },
  { name: "Sundae's Best Caramel Nut Crunch", price: 50, category: 'Chillers', description: 'Rocky road sundae with toppings', image: 'caramel.png' },
  { name: "Sundae's Best Strawberry Crunch", price: 50, category: 'Chillers', description: 'Graham pampig sundae with toppings', image: 'strawberry.png' },
];

const staffList = [
  { staffCode: 'EMP001', name: 'Juan Dela Cruz', role: 'Employee', contact: '09123456789', status: 'Active', dateAdded: '2026-06-01', password: 'juan2024' },
  { staffCode: 'EMP002', name: 'Maria Santos', role: 'Employee', contact: '09987654321', status: 'Active', dateAdded: '2026-06-01', password: 'maria2024' },
  { staffCode: 'ADM001', name: 'Rcp', role: 'Admin', contact: '', status: 'Active', dateAdded: '2026-06-01', password: 'admin2024' },
];

async function seed() {
  await MenuItem.deleteMany({});
  await Staff.deleteMany({});
  await Settings.deleteMany({});

  await MenuItem.insertMany(menuItems);
  await Staff.insertMany(staffList);
  await Settings.create({
    kioskName: 'Chut Chut',
    transactionModes: ['Dine In', 'Take Out', 'Grab'],
    paymentModes: ['Cash', 'Online Payment'],
  });

  console.log(`Seeded ${menuItems.length} menu items, ${staffList.length} staff accounts, and 1 settings doc.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});