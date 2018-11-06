const express = require('express');

const shopController = require('../controllers/shop');
const {
  getHome,
  getProducts,
  getProductById,
  getCart
} = shopController;

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.get('/cart', getCart);
router.get('/', getHome);

module.exports = router;