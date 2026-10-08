const schema_mongoose = require('mongoose');

const CatalogSchema = schema_mongoose.Schema(
    {
       sku: { type: String, required: true, unique: true }, // Added to link to inventory
       name: { type: String, required: true },
       description: { type: String, required: true },
       price: { type: Number, required: true },
       category: { type: String }
    }, 
    { timestamps: true }
);

module.exports = schema_mongoose.model('Catalog', CatalogSchema, 'Catalog');