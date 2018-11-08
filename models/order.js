const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  products: [{
    productData: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    email: {
      type: String,
      required: true
    }
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;