const express = require('express');
const mongoose = require('mongoose'); // Needed for MongoDB operations
require('dotenv').config(); // Needed to load your MONGO_URI

const app = express();
app.use(express.json()); // Essential: Allows your app to read JSON from Postman

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Product Catalog Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Product Schema (matching your DB)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String }
});

// The third parameter 'Catalog' maps this directly to the Catalog collection in your MongoDB
const Product = mongoose.model('Product', productSchema, 'Catalog');

// --- APIs ---

// CREATE API - POST /products (Manager only)
app.post('/products', async (req, res) => {
  try {
    // Inserts a new product definition into the database based on Postman's body
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// READ API - GET /products/:id (Manager & Worker)
app.get('/products/:id', async (req, res) => {
  try {
    // 1. Get the product metadata from the Catalog database
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // 2. Make an HTTP call to your Inventory Microservice (Port 5004)
    let availableQuantity = 0;
    try {
      const inventoryResponse = await fetch(`http://localhost:5004/inventory/${product.sku}`);
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        availableQuantity = inventoryData.quantity; // Extract the quantity
      }
    } catch (inventoryError) {
      console.log("Could not reach Inventory service. Defaulting to 0.");
    }

    // 3. Combine the Product data with the Inventory quantity
    const combinedResponse = {
      _id: product._id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      availableStock: availableQuantity // Now displays the live inventory count!
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// UPDATE API - PUT /products/:id (Manager only)
app.put('/products/:id', async (req, res) => {
  try {
    // Finds the exact product by ID and updates its details in one step using the request body
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Not Found to Update" });
    }
    res.status(200).json({ message: "Product successfully updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// START THE EXPRESS SERVER.
app.listen(5003, () => 
  console.log('EXPRESS Server Started at Port No: 5003')
);