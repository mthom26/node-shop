require('dotenv').config();
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const nanoid = require('nanoid');

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const db = require('./models');
const { get404 } = require('./controllers/error');

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions'
});
const csrfProtection = csurf();

// Configure multer file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const randomString = nanoid(8);
    cb(null, `${randomString}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    //accept file
    cb(null, true);
  } else {
    // reject file
    cb(null, false);
  }
};

app.engine('hbs', expressHbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded());
app.use(multer({ storage: fileStorage, fileFilter }).single('image')); // forms will be sending an input named 'image'
app.use(express.static(path.join(path.dirname(process.mainModule.filename), 'public')));
app.use('/images', express.static(path.join(path.dirname(process.mainModule.filename), 'images')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
// csrf should be after the session
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
  if(!req.session.user) {
    // No user on request
    return next();
  }

  try {
    const user = await db.User.findById(req.session.user._id);
    if(!user) {
      // User could not be found in database
      return next();
    }
    req.user = user;
    res.locals.isAuthenticated = true;
    if(user.isAdmin) {
      res.locals.isAdmin = true;
    }
    next();
  } catch(err) {
    throw new Error(err);
  }
  /*
  if(req.session.user.isAdmin) {
    res.locals.isAdmin = true;
  }
  // Otherwise user is present so set isAuthenticated
  res.locals.isAuthenticated = true;
  return next();
  */
});

app.use(async (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(get404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});