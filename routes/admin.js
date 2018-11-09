const express = require('express');

const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');
const {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
} = adminController;
const {
  isAdmin
} = authMiddleware;

const router = express.Router();

router.get('/products', isAdmin, getProducts);
router.get('/add-product', isAdmin, getAddProduct);
router.post('/add-product', isAdmin, postAddProduct);
router.get('/edit-product/:productId', isAdmin, getEditProduct);
router.post('/edit-product/:productId', isAdmin, postEditProduct);
router.post('/delete-product/:productId', isAdmin, postDeleteProduct);

module.exports = router;