require('dotenv').config();
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const shopRoutes = require('./routes/shop');
const db = require('./models');

const app = express();

app.engine('hbs', expressHbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(path.dirname(process.mainModule.filename), 'public')));

app.use(shopRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});