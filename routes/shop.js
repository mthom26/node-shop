const express = require('express');

const shopController = require('../controllers/shop');
const {
  getHome,
  getProducts
} = shopController;

const router = express.Router();

router.get('/products', getProducts);
router.get('/', getHome);

module.exports = router;