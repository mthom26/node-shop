const express = require('express');

const shopController = require('../controllers/shop');
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

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart/remove', postRemoveCart);
router.get('/orders', getOrders);
router.post('/orders/create', postOrder);
router.get('/', getHome);

module.exports = router;