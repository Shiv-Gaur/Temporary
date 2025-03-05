// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (adjust URI as needed)
mongoose.connect('mongodb://localhost:27017/paymentApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Mongoose Schemas
const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // In production, store hashed passwords.
  email: String,
  mobile: String,
  cardDetails: {
    cardNumber: String,
    expiry: String,
    cvv: String
  },
  balance: { type: Number, default: 1000 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

const TransactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  location: { type: String }, // Human-readable location name
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Reverse geocode using Nominatim (OpenStreetMap)
async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'jsonv2',
        lat,
        lon: lng
      },
      headers: { 'User-Agent': 'PaymentApp/1.0' }
    });
    return response.data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${lat}, ${lng}`;
  }
}

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, email, mobile, cardDetails } = req.body;
  const { cardNumber, expiry, cvv } = cardDetails;

  // Validate card number: 16 digits and valid VISA (starts with 4) or MasterCard (starts with 51-55)
  const cardRegex = /^(4\d{15}|5[1-5]\d{14})$/;
  if (!cardRegex.test(cardNumber)) {
    return res.status(400).json({ message: 'Invalid card number. Must be 16 digits and a valid VISA or MasterCard.' });
  }
  // Validate CVV: exactly 3 digits.
  if (!/^\d{3}$/.test(cvv)) {
    return res.status(400).json({ message: 'Invalid CVV. Must be exactly 3 digits.' });
  }
  // Validate expiry: MM/YY and not expired.
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) {
    return res.status(400).json({ message: 'Invalid expiry format. Must be in MM/YY format.' });
  }
  const [expMonth, expYear] = expiry.split('/').map(Number);
  const fullExpYear = 2000 + expYear;
  const now = new Date();
  const expiryDate = new Date(fullExpYear, expMonth - 1, 1);
  if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
    return res.status(400).json({ message: 'Card expiry date is in the past.' });
  }
  // Validate email format.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  // Validate mobile number (E.164 format)
  const mobileRegex = /^\+\d{10,15}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: 'Invalid mobile number. Ensure it is in full E.164 format.' });
  }

  const newUser = new User({ username, password, email, mobile, cardDetails });
  await newUser.save();
  res.json({ message: 'User registered successfully', user: newUser });
});

// Login endpoint (simple username/password)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get updated user details (for refreshing balance, etc.)
app.get('/api/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ user });
});

// Transaction endpoint with location reverse geocoding
app.post('/api/transaction', async (req, res) => {
  const { senderId, recipientUsername, amount, location } = req.body;
  const sender = await User.findById(senderId);
  const recipient = await User.findOne({ username: recipientUsername });
  if (!sender || !recipient) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (sender.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  let locationName = 'Unknown Location';
  if (location && location.lat && location.lng) {
    locationName = await reverseGeocode(location.lat, location.lng);
  }

  const transaction = new Transaction({ from: sender._id, to: recipient._id, amount, location: locationName });
  await transaction.save();

  sender.balance -= amount;
  recipient.balance += amount;
  sender.transactions.push(transaction._id);
  recipient.transactions.push(transaction._id);

  await sender.save();
  await recipient.save();

  res.json({ message: 'Transaction successful', transaction });
});

// Transaction history endpoint
app.get('/api/transactions/:userId', async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ from: req.params.userId }, { to: req.params.userId }]
  }).populate('from to');
  res.json({ transactions });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
