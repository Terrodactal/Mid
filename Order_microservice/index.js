const express = require('express');
const mongoose = require('mongoose'); // Needed for MongoDB operations
require('dotenv').config(); // Needed to load your MONGO_URI

const app = express();
app.use(express.json()); // Essential: Allows your app to read JSON from Postman

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Order Fulfillment Service Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Order Schema (matching your DB)
const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    itemSku: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

// Strictly maps to the 'Fulfillment' collection in MongoDB based on your database design[cite: 2]
const Order = mongoose.model('Order', orderSchema, 'Fulfillment');

// --- APIs ---

// CREATE ORDER API - POST /orders (Manager only)
app.post('/orders', async (req, res) => {
    try {
        // Creates a new dispatch order in the database based on Postman's body
        const newOrder = new Order({
            customerName: req.body.customerName,
            itemSku: req.body.itemSku,
            quantity: req.body.quantity,
            status: 'pending' // Defaults to pending when first dispatched
        });
        
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// VIEW PENDING ORDERS API - GET /orders/pending (Worker only)
app.get('/orders/pending', async (req, res) => {
    try {
        // Retrieves only the documents where the status is currently 'pending'
        const pendingOrders = await Order.find({ status: 'pending' });
        res.status(200).json(pendingOrders);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// UPDATE STATUS API - PUT /orders/:id/status (Worker only)
app.put('/orders/:id/status', async (req, res) => {
    try {
        // Finds the exact order by the ID passed in the URL parameter and updates its status
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, // Expects 'picked' or 'packed' in Postman's JSON body
            { new: true } // Returns the newly updated document
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order Not Found to Update" });
        }
        res.status(200).json({ message: "Order status successfully updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// START THE EXPRESS SERVER. 
app.listen(5005, () =>
    console.log('EXPRESS Server Started at Port No: 5005'));