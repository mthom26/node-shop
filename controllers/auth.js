const getLogin = async (req, res) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

const postLogin = async (req, res) => {

};

const getSignUp = async (req, res) => {
  res.render('signup', {
    pageTitle: 'Sign Up'
  });
};

const postSignUp = async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  
  res.redirect('/');
}

module.exports = {
  getLogin,
  postLogin,
  getSignUp,
  postSignUp
}