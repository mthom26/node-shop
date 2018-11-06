const db = require('../models');

const getProducts = async (req, res) => {
  const products = await db.Product.find();
  res.render('admin/products', {
    pageTitle: 'Admin Products',
    products
  });
};

const getAddProduct = async (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Admin Add Product'
  });
};

const postAddProduct = async (req, res) => {
  const { name, price, imageUrl, description } = req.body;
  const newProduct = new db.Product({
    name,
    price,
    imageUrl: `https://robohash.org/${name}`,
    description,
    userId: req.session.user._id
  });
  await newProduct.save();
  res.redirect('/admin/products');
}

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct
};