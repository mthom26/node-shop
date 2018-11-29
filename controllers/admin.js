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
  const { name, price, description } = req.body;
  const image = req.file;
  const imageUrl = image ? image.path : `https://robohash.org/${name}`;

  const newProduct = new db.Product({
    name,
    price,
    imageUrl,
    description,
    userId: req.session.user._id
  });
  await newProduct.save();
  res.redirect('/admin/products');
};

const getEditProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await db.Product.findById(productId);
  console.log(product);
  res.render('admin/editProduct', {
    pageTitle: `Edit Product: `,
    product
  });
};

const postEditProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, description } = req.body;
  const image = req.file;
  // Should check here whether a new image was attached, if not then dont update 
  // the product imageUrl below in 'findByIdAndUpdate'
  const imageUrl = image ? image.path : `https://robohash.org/${name}`;

  await db.Product.findByIdAndUpdate(productId, {
    name,
    price,
    imageUrl,
    description
  });
  res.redirect('/admin/products');
};

const postDeleteProduct = async (req, res) => {
  const { productId } = req.params;
  await db.Product.findByIdAndDelete(productId);
  res.redirect('/admin/products');
};

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
};