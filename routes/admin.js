const express = require('express');

const adminController = require('../controllers/admin');
const {
  getProducts,
  getAddProduct,
  postAddProduct
} = adminController;

const router = express.Router();

router.get('/products', getProducts);
router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);

module.exports = router;