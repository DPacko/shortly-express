const parseCookies = (req, res, next) => {
  if (req["cookies"] === undefined || req.get("Cookie") === undefined) {
    req["cookies"] = {};
    // next();
    return next();
  }
  if (req.get("Cookie")) {
    // console.log(req.get('Cookie').split(/; */g));
    req
      .get("Cookie")
      .split(/; */g)
      .forEach(cookie => {
        let c = cookie.split("=");
        req["cookies"][c[0]] = c[1];
      });
    return next();
  }
};

module.exports = parseCookies;
