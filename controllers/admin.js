const db = require('../models');

const getProducts = async (req, res) => {
  res.render('admin/products', {
    pageTitle: 'Admin Products'
  });
};

const getAddProduct = async (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Admin Add Product'
  });
};

module.exports = {
  getProducts,
  getAddProduct
};