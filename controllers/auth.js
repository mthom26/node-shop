const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const db = require('../models');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

const getLogin = async (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    error: req.flash('error')
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ email: email });
  if(!user) {
    // User not found
    req.flash('error', 'Invalid Email/Password');
    return res.redirect('/login');
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if(!passwordMatch) {
    // Password Incorrect
    req.flash('error', 'Invalid Email/Password');
    return res.redirect('/login');
  }
  // User is logged in
  req.session.user = user;
  req.session.save();
  res.redirect('/');
};

const getSignUp = async (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    error: req.flash('error')
  });
};

const postSignUp = async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  const user = await db.User.findOne({ email: email });
  if(user) {
    // User with that email already exists
    req.flash('error', 'That email is already taken.')
    return res.redirect('/signup');
  }
  const hash = await bcrypt.hash(password, 12);
  const newUser = new db.User({
    email,
    password: hash,
    isAdmin: false
  });
  newUser.save();
  req.session.user = newUser;
  req.session.save();
  res.redirect('/');
  transporter.sendMail({
    to: email,
    from: 'shop@nodeshop.com',
    subject: 'Signup Successful!',
    html: '<h1>Welcome to NodeShop!</h1>'
  });
};

const postLogout = async (req, res) => {
  req.session.destroy(err => {
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

module.exports = {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp,
  postLogout
};