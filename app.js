require('dotenv').config();
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const db = require('./models');

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
});
const csrfProtection = csurf();

app.engine('hbs', expressHbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(path.dirname(process.mainModule.filename), 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
// csrf should be after the session
app.use(csrfProtection);

app.use(async (req, res, next) => {
  if(!req.session.user) {
    // No user on request
    return next();
  }
  if(req.session.user.isAdmin) {
    res.locals.isAdmin = true;
  }
  // Otherwise user is present so set isAuthenticated
  res.locals.isAuthenticated = true;
  return next();
});

app.use(async (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});