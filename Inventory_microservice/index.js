const express = require('express');
const mongoose = require('mongoose'); // Needed for MongoDB operations
require('dotenv').config(); // Needed to load your MONGO_URI

const app = express();
app.use(express.json()); // Essential: Allows your app to read JSON from Postman

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Inventory Tracking Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Inventory Schema (matching your DB)
const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 }
});
// Maps directly to the 'Inventory' collection in MongoDB
const Inventory = mongoose.model('Inventory', inventorySchema, 'Inventory');

// --- APIs ---

// READ API - GET /inventory/:sku (Manager & Worker)
app.get('/inventory/:sku', async (req, res) => {
  try {
    // Queries the database for current stock levels using the SKU provided in the URL
    const item = await Inventory.findOne({ sku: req.params.sku });
    
    if (!item) {
      return res.status(404).json({ message: "Inventory Item Not Found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ADJUST API - PUT /inventory/:sku/adjust (Worker only)
app.put('/inventory/:sku/adjust', async (req, res) => {
  try {
    // Finds the exact inventory record by SKU and updates its quantity in one step
    const updatedInventory = await Inventory.findOneAndUpdate(
      { sku: req.params.sku }, 
      { quantity: req.body.quantity }, // Expects a new 'quantity' value in Postman's JSON body
      { new: true } // Returns the updated document
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: "Inventory Item Not Found to Adjust" });
    }
    res.status(200).json({ message: "Stock successfully adjusted", inventory: updatedInventory });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// START THE EXPRESS SERVER.
app.listen(5004, () => 
  console.log('EXPRESS Server Started at Port No: 5004')
);