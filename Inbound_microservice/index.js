const express = require('express');
const mongoose = require('mongoose'); // Needed for MongoDB operations
require('dotenv').config(); // Needed to load your MONGO_URI

const app = express();
app.use(express.json()); // Essential: Allows your app to read JSON from Postman

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Inbound Receiving Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Shipment Schema (matching your DB)
const shipmentSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  itemSku: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' }
});
const Shipment = mongoose.model('Shipment', shipmentSchema, 'shipment_collections');

// --- APIs ---

// CREATE API - POST /shipments (Manager only)
app.post('/shipments', async (req, res) => {
  try {
    // Creates a new expected shipment record in the database based on Postman's body
    const newShipment = new Shipment({
      supplierName: req.body.supplierName,
      itemSku: req.body.itemSku,
      quantity: req.body.quantity,
      status: 'pending'
    });
    
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// VERIFY API - PUT /shipments/:id/verify (Worker only)
app.put('/shipments/:id/verify', async (req, res) => {
  try {
    // Finds the exact shipment by ID and updates its status to received in one step
    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id, 
      { status: 'received' },
      { new: true } // Returns the updated document
    );

    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment Not Found" });
    }
    res.status(200).json({ message: "Shipment successfully verified", shipment: updatedShipment });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// START THE EXPRESS SERVER.
app.listen(5006, () => 
  console.log('EXPRESS Server Started at Port No: 5006')
);