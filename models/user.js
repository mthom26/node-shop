const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
});

userSchema.methods.addToCart = async function(productId) {
  const cartProductIndex = this.cart.items.findIndex(item => {
    return item.productId.toString() === productId;
  });
  let newQuantity = 1;
  const updatedCartItems = [ ...this.cart.items ];

  if(cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId,
      quantity: newQuantity
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = async function(productId) {
  const updatedProduct = this.cart.items.filter(item => {
    return item.productId.toString() === productId;
  });
 
  const updatedCart = { ...this.cart };
  updatedCart.items = updatedCart.items.filter(item => {
    return item.productId.toString() !== productId;
  });
  
  updatedProduct[0].quantity = updatedProduct[0].quantity - 1;
  if(updatedProduct[0].quantity > 0) {
    updatedCart.items.push(updatedProduct[0]);
  }
  
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = async function() {
  this.cart = {
    items: []
  };
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;