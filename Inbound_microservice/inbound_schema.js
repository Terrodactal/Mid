const schema_mongoose = require('mongoose');

const InboundSchema = schema_mongoose.Schema(
    {
       supplierName: { type: String, required: true },
       itemSku: { type: String, required: true },
       quantity: { type: Number, required: true },
       status: { type: String, default: 'pending' }
    }, 
    {
       timestamps: true
    }
);

// The third parameter 'Inbound' ensures it strictly maps to the Inbound collection in MongoDB[cite: 2]
module.exports = schema_mongoose.model('Inbound', InboundSchema, 'Inbound');