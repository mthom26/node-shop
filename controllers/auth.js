const db = require('../models');

const getLogin = async (req, res) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ email: email });
  if(!user) {
    // User not found
    return res.redirect('/login');
  }
  const passwordMatch = user.password === password;
  if(!passwordMatch) {
    // Password Incorrect
    return res.redirect('/login');
  }
  // User is logged in
  req.session.user = user;
  req.session.save();
  res.redirect('/');
};

const getSignUp = async (req, res) => {
  res.render('signup', {
    pageTitle: 'Sign Up'
  });
};

const postSignUp = async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  const user = await db.User.findOne({ email: email });
  if(user) {
    // User with that email already exists
    console.log('User already exists');
    return res.redirect('/signup');
  }
  const newUser = new db.User({
    email,
    password,
    isAdmin: false
  });
  newUser.save();
  req.session.user = newUser;
  req.session.save();
  res.redirect('/');
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