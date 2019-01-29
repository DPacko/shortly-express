const sessions = require("../models").Sessions;
const Promise = require("bluebird");

module.exports.createSession = (req, res, next) => {
  // if user has no no cookies,
  console.log(req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    // generate a session w/ a unique hash and store it in sessions table
    let newHash = sessions.create();

    req["session"] = {
      hash: newHash
    };
    res.cookies = {};
    res.cookies["shortlyid"] = {
      value: ""
    };
    return next();
  }
  console.log("############################");
  // console.log(req.username);
  req["session"] = {
    hash: req.cookies.shortlyid
    // user: {username : req.body.username},
    // userid:
  };

  // this unique hash sets the cookie in response header
  // if cookie exists, need to verify it's valid by checking on sessions table
  // if not valid,
  return next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
