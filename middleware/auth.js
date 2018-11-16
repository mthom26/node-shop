const isAuthenticated = (req, res, next) => {
  if(req.user) {
    return next();
  }
  console.log('No User');
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if(req.user) {
    if(req.user.isAdmin) {
      return next();
    }
    console.log('Not Admin');
    return res.redirect('/login');
  }
  console.log('No User');
  res.redirect('/login');
};

module.exports = {
  isAuthenticated,
  isAdmin
};