const db = require('../models');

const getHome = async (req, res) => {
  res.render('index', {
    pageTitle: 'Home'
  });
};

const getProducts = async (req, res) => {
  //const products = await db.Product.find();
  //console.log(products);
  res.render('products', {
    pageTitle: 'Products',
    //products: products
  });
};

module.exports = {
  getHome,
  getProducts
};