const fs = require('fs');
const path = require('path');

const db = require('../models');

const getHome = async (req, res) => {
  res.render('shop/index', {
    pageTitle: 'Home',
    successMessage: req.flash('successMessage')
  });
};

const getProducts = async (req, res, next) => {
  try {
    const products = await db.Product.find();
    res.render('shop/products', {
      pageTitle: 'Products',
      products
    });
  } catch(err) {
    return next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await db.Product.findById(productId);
    res.render('shop/productDetail', {
      pageTitle: `Product Details: ${product.name}`,
      product
    });
  } catch(err) {
    return next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.user._id);
    await user.populate('cart.items.productId').execPopulate();
    res.render('shop/cart', {
      pageTitle: 'Cart',
      cart: user.cart.items,
      userEmail: user.email
    });
  } catch(err) {
    return next(err);
  }
};

const postCart = async (req, res, next) => {
  try {
    console.log(req.user._id);
    const user = await db.User.findById(req.user._id);
    const { id } = req.body;
    await user.addToCart(id);
    res.redirect('/products');
  } catch(err) {
    return next(err);
  }
};

const postRemoveCart = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.user._id);
    const { id } = req.body;
    await user.removeFromCart(id);
    res.redirect('/products');
  } catch(err) {
    return next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await db.Order.find({ 'user.userId': req.user._id });
    console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Orders',
      userEmail: req.user.email,
      orders
    });
  } catch(err) {
    return next(err);
  }
};

const postOrder = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.user._id);
    await user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items.map(product => {
      return {
        quantity: product.quantity,
        productData: product.productId._doc
      }
    });
    const newOrder = new db.Order({
      user: {
        email: req.user.email,
        userId: req.user._id
      },
      products
    });
    await newOrder.save();
    await user.clearCart();
    
    res.redirect('/cart');
  } catch(err) {
    return next(err);
  }
};

const getInvoice = async (req, res, next) => {
  const { orderId } = req.params;
  // TODO - add orderId to invoiceName after invoices are generated with proper names
  const invoiceName = `order.pdf`;
  const invoicePath = path.join('data', 'invoices', invoiceName);

  fs.readFile(invoicePath, (err, data) => {
    if(err) {
      return next(err);
    }
    res.setHeader('Content-Type', 'application/pdf');
    // Content-Disposition attachment not working, see - 
    // https://stackoverflow.com/questions/26737883/content-dispositionattachment-not-triggering-download-dialog
    res.setHeader('Content-Disposition', 'attachment; filename="hello.pdf"');
    res.send(data);
  });
};

module.exports = {
  getHome,
  getProducts,
  getProductById,
  getCart,
  postCart,
  postRemoveCart,
  getOrders,
  postOrder,
  getInvoice
};