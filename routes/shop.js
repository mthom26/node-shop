const express = require('express');

const shopController = require('../controllers/shop');
const authMiddleware = require('../middleware/auth');
const {
  getHome,
  getProducts,
  getProductById,
  getCart,
  postCart,
  postRemoveCart,
  getOrders,
  postOrder
} = shopController;
const {
  isAuthenticated
} = authMiddleware;

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.get('/cart', isAuthenticated, getCart);
router.post('/cart', isAuthenticated, postCart);
router.post('/cart/remove', isAuthenticated, postRemoveCart);
router.get('/orders', isAuthenticated, getOrders);
router.post('/orders/create', isAuthenticated, postOrder);
router.get('/', getHome);

module.exports = router;