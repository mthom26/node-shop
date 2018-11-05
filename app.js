require('dotenv').config();
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const db = require('./models');

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
});

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

app.use(async (req, res, next) => {
  if(!req.session.user) {
    // No user on request
    return next();
  }
  // Otherwise find user and attach it to request
  return next();
});

app.use(authRoutes);
app.use(shopRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});