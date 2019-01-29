const parseCookies = (req, res, next) => {
  console.log(req.headers);
  next();
};

module.exports = parseCookies;
