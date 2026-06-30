require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port', process.env.PORT || 3000);
})

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

const Order = mongoose.model('Order', new mongoose.Schema({
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  transactionMode: String,
  paymentMode: String,
  timestamp: { type: Date, default: Date.now }
}));

const Settings = mongoose.model('Settings', new mongoose.Schema({
  kioskName: { type: String, default: 'Chut Chut' },
  transactionModes: { type: [String], default: ['Dine In', 'Take Out', 'Grab'] },
  paymentModes: { type: [String], default: ['Cash', 'Online Payment'] }
}));


app.get('/api/menu', async (req, res) => {
  const menu = await MenuItem.find();
  res.send(menu);console.log("Fetched all menu items");
});

app.post('/api/menu', async (req, res) => {
  const item = new MenuItem(req.body);
  await item.save();
  res.send(item);console.log("Added new menu item:", item);
});

//Delete request for a menu item
app.delete('/api/menu/:id', async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).send(); // 204 means that we have successful deletion
})

//Update request for a menu item
app.put('/api/menu/:id', async (req, res) => {
  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updatedItem);
})


app.get('/api/staff', async (req, res) => {
  const staff = await Staff.find();
  res.send(staff);console.log("Fetched all staff");
});

app.post('/api/staff', async (req, res) => {
  const staff = new Staff(req.body);
  await staff.save();
  res.send(staff);console.log("Added new staff:", staff);
});

//Delete request for a staff member
app.delete('/api/staff/:id', async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.status(204).send();
})

//Update request for a staff member
app.put('/api/staff/:id', async (req, res) => {
  const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updatedStaff);
})

//Login request for staff (used by the kiosk login screen)
app.post('/api/staff/login', async (req, res) => {
  const { staffCode, password } = req.body;
  const match = await Staff.findOne({
    staffCode: new RegExp(`^${staffCode?.trim()}$`, 'i'),
    password,
    status: 'Active'
  });
  if (!match) {
    return res.status(401).send({ success: false, message: 'Invalid Staff ID or password.' });
  }
  res.send({ success: true, message: `Welcome, ${match.name}!`, staff: match });
})


app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ timestamp: -1 });
  res.send(orders);console.log("Fetched all orders");
});

app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.send(order);console.log("Placed new order:", order);
});

//Delete a single order
app.delete('/api/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).send();
})

//Reset all orders (e.g. "reset daily sales" in the admin panel)
app.delete('/api/orders', async (req, res) => {
  await Order.deleteMany({});
  res.status(204).send();
})


app.get('/api/settings', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.send(settings);console.log("Fetched kiosk settings");
});

app.put('/api/settings', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
  }
  res.send(settings);console.log("Updated kiosk settings:", settings);
})