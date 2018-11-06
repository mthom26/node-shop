const express = require('express');

const adminController = require('../controllers/admin');
const {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
} = adminController;

const router = express.Router();

router.get('/products', getProducts);
router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);
router.get('/edit-product/:productId', getEditProduct);
router.post('/edit-product/:productId', postEditProduct);
router.post('/delete-product/:productId', postDeleteProduct);

module.exports = router;