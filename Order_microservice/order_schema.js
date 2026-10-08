const schema_mongoose = require('mongoose');

const orderSchema = schema_mongoose.Schema(
    {
       customerName: { type: String, required: true },
       itemSku: { type: String, required: true },
       quantity: { type: Number, required: true },
       status: { type: String, default: 'pending' }
    }, 
    {
       timestamps: true
    }
);

// The third parameter 'Fulfillment' guarantees it saves into the Fulfillment collection
module.exports = schema_mongoose.model('Order', orderSchema, 'Fulfillment');