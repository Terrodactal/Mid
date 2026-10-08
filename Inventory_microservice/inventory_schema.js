const schema_mongoose = require('mongoose');

const InventorySchema = schema_mongoose.Schema(
    {
       sku: { type: String, required: true, unique: true },
       quantity: { type: Number, required: true, default: 0 }
    }, 
    {
       timestamps: true
    }
);

// The third parameter 'Inventory' ensures it strictly maps to the Inventory collection in MongoDB
module.exports = schema_mongoose.model('Inventory', InventorySchema, 'Inventory');