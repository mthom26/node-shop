const express = require('express');

const authController = require('../controllers/auth');
const {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp,
  postLogout,
  getPasswordReset,
  postPasswordReset,
  getNewPassword,
  postNewPassword
} = authController;

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/signup', getSignUp);
router.post('/signup', postSignUp);
router.post('/logout', postLogout);
router.get('/password-reset/:token', getNewPassword);
router.get('/password-reset', getPasswordReset);
router.post('/password-reset', postPasswordReset);
router.post('/new-password', postNewPassword);


module.exports = router;
