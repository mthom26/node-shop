const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.connect(process.env.DATABASE_URI, (err) => {
  if(err) {
    console.log(`Could not connect to Database: ${env}`);
  } else {
    console.log(`Connected to Database: ${process.env.DATABASE_URI}`);
  }
});

module.exports.User = require('./user');
module.exports.Product = require('./product');
module.exports.Order = require('./order');