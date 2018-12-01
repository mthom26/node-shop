const db = require('../models');

const getProducts = async (req, res, next) => {
  try {
    const products = await db.Product.find();
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      products
    });
  } catch(err) {
    return next(err);
  }
};

const getAddProduct = async (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Admin Add Product'
  });
};

const postAddProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file;
    // TODO - add default product image instead of robohash which won't work
    // due to adding a '/' on the img src on the productCard partial
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
  } catch(err) {
    return next(err);
  }
};

const getEditProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await db.Product.findById(productId);
    console.log(product);
    res.render('admin/editProduct', {
      pageTitle: `Edit Product: `,
      product
    });
  } catch(err) {
    return next(err);
  }
};

const postEditProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, price, description } = req.body;
    const image = req.file;
    
    const product = await db.Product.findById(productId);
    if(image) {
      product.imageUrl = image.path;
    }
    product.name = name;
    product.price = price;
    product.description = description;

    await product.save();
    res.redirect('/admin/products');
  } catch(err) {
    return next(err);
  }
};

const postDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await db.Product.findByIdAndDelete(productId);
    res.redirect('/admin/products');
  } catch(err) {
    return next(err);
  }
};

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
};