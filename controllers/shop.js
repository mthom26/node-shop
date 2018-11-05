const getHome = async (req, res) => {
  res.render('index', {
    pageTitle: 'Home'
  });
};

const getProducts = async (req, res) => {
  res.render('products', {
    pageTitle: 'Products'
  });
};

module.exports = {
  getHome,
  getProducts
};