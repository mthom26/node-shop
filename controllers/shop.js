const db = require('../models');

const getHome = async (req, res) => {
  res.render('shop/index', {
    pageTitle: 'Home'
  });
};

const getProducts = async (req, res) => {
  const products = await db.Product.find();
  //console.log(products);
  res.render('shop/products', {
    pageTitle: 'Products',
    products
  });
};

const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await db.Product.findById(productId);
  res.render('shop/productDetail', {
    pageTitle: `Product Details: ${product.name}`,
    product
  });
};

const getCart = async (req, res) => {
  res.redirect('/');
};

const postCart = async (req, res) => {
  console.log(req.session.user._id);
  const user = await db.User.findById(req.session.user._id);
  const { id } = req.body;
  await user.addToCart(id);
  //console.log(`Controller: ${req.body.id}`);
  res.redirect('/products');
};

module.exports = {
  getHome,
  getProducts,
  getProductById,
  getCart,
  postCart
};