// const parseCookies = (req, res, next) => {
//   if (req["cookies"] === undefined || req.get("Cookie") === undefined) {
//     req["cookies"] = {};
//     // next();
//     return next();
//   }
//   if (req.get("Cookie")) {
//     // console.log(req.get('Cookie').split(/; */g));
//     req
//       .get("Cookie")
//       .split(/; */g)
//       .forEach(cookie => {
//         let c = cookie.split("=");
//         req["cookies"][c[0]] = c[1];
//       });
//     return next();
//   }
// };

// module.exports = parseCookies;

const parseCookies = (req, res, next) => {
  let cookieString = req.get("Cookie") || "";

  parsedCookies = cookieString.split("; ").reduce((cookies, cookie) => {
    if (cookie.length) {
      let index = cookie.indexOf("=");
      let key = cookie.slice(0, index);
      let token = cookie.slice(index + 1);
      cookies[key] = token;
    }
    return cookies;
  }, {});

  req.cookies = parsedCookies;

  next();
};

module.exports = parseCookies;
