const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

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

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ email: email });
    if(!user) {
      // User not found
      req.flash('error', 'Invalid Email/Password');
      return (
        res.render('auth/login', {
          pageTitle: 'Login',
          error: req.flash('error'),
          prevInput: { email, password }
        })
      );
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      // Password Incorrect
      req.flash('error', 'Invalid Email/Password');
      return (
        res.render('auth/login', {
          pageTitle: 'Login',
          error: req.flash('error'),
          prevInput: { email, password }
        })
      );
    }
    // User is logged in
    req.session.user = user;
    req.session.save();
    res.redirect('/');
  } catch(err) {
    return next(err);
  }
};

const getSignUp = async (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    error: req.flash('error')
  });
};

const postSignUp = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    const user = await db.User.findOne({ email: email });
    if(user) {
      // User with that email already exists
      req.flash('error', 'That email is already taken.')
      return (
        res.render('auth/signup', {
          pageTitle: 'Sign Up',
          error: req.flash('error'),
          prevInput: { email, password, passwordConfirm }
        })
      );
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
  } catch(err) {
    return next(err);
  }
};

const postLogout = async (req, res) => {
  req.session.destroy(err => {
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

const getPasswordReset = async (req, res) => {
  res.render('auth/passwordReset', {
    pageTitle: 'Password Reset',
    error: req.flash('error'),
    successMessage: req.flash('successMessage')
  });
};

const postPasswordReset = async (req, res, next) => {
  try{
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString('hex');

    const user = await db.User.findOne({ email });
    if(!user) {
      req.flash('error', 'No User with that email found.');
      res.redirect('/password-reset');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Expire 1 hour from now
    await user.save();

    req.flash('successMessage', `We have sent a password reset email to ${email}`);
    res.redirect('/password-reset');
    transporter.sendMail({
      to: email,
      from: 'shop@nodeshop.com',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="http://localhost:3000/password-reset/${token}">this link</a> to reset your password</p>
      `
    });
  } catch(err) {
    return next(err);
  }
};

const getNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await db.User.findOne({
      resetToken: token,
      resetTokenExpiration: {$gt: Date.now()}
    });

    if(!user) {
      req.flash('error', 'That link is out of date/does not exist');
      res.redirect('/password-reset');
    }
    
    res.render('auth/newPassword', {
      pageTitle: 'Password Update',
      error: req.flash('error'),
      successMessage: req.flash('successMessage'),
      userId: user._id
    });
  } catch(err) {
    return next(err);
  }
};

const postNewPassword = async (req, res, next) => {
  try {
    const { userId, password, passwordConfirm } = req.body;

    const user = await db.User.findById(userId);
    if(!user) {
      req.flash('error', 'That User could not be found.');
      res.redirect('/password-reset');
    }

    const hash = await bcrypt.hash(password, 12);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    req.flash('successMessage', 'You successfully reset your password!');
    res.redirect('/');
  } catch(err) {
    return next(err);
  }
};

module.exports = {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp,
  postLogout,
  getPasswordReset,
  postPasswordReset,
  getNewPassword,
  postNewPassword
};