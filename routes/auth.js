const express = require('express');

const authController = require('../controllers/auth');
const {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp
} = authController;

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/signup', getSignUp);
router.post('/signup', postSignUp);

module.exports = router;
