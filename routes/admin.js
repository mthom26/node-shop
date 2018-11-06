const express = require('express');

const adminController = require('../controllers/admin');
const {
  getProducts,
  getAddProduct
} = adminController;

const router = express.Router();

router.get('/products', getProducts);
router.get('/add-product', getAddProduct);

module.exports = router;