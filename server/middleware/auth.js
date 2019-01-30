const Sessions = require("../models").Sessions;
const Promise = require("bluebird");
const Users = require("../models").Users;
const models = require("../models");

// module.exports.createSession = (req, res, next) => {
//   //   // if user has no no cookies,

//   //   if (Object.keys(req.cookies).length === 0) {
//   //     // generate a session w/ a unique hash and store it in sessions table
//   //     res.cookies = {};
//   //     res.cookies["shortlyid"] = {
//   //       value: ""
//   //     };
//   //     Sessions.create().then(result => {
//   //       Sessions.get({ id: result.insertId }).then(result => {
//   //         req["session"] = {
//   //           hash: result.hash
//   //         };
//   //         return next();
//   //       });
//   //     });
//   //   } else {
//   //     req["session"] = {
//   //       hash: req.cookies.shortlyid
//   //     };
//   //     Sessions.get({ hash: req.cookies.shortlyid })
//   //       .then(result => {
//   //         req["session"] = {
//   //           user: { username: result.user.username },
//   //           userId: result.user.id
//   //         };
//   //         next();
//   //       })
//   //       .catch(err => {
//   //         console.log("err");
//   //         next();
//   //       });
//   //     // this unique hash sets the cookie in response header
//   //     // if cookie exists, need to verify it's valid by checking on sessions table
//   //     // if not valid,
//   //     // return next();
//   //   }
//   // };

//   if (Object.keys(req.cookies).length === 0) {
//     // generate a session w/ a unique hash and store it in sessions table

//     Sessions.create()
//       .then(result => {
//         return Sessions.get({ id: result.insertId });
//       })
//       .then(newSession => {
//         if (!newSession) {
//           throw "session create failed";
//         }
//         res.cookie("shortlyid", newSession.hash);
//         next();
//       })
//       .catch(err => {
//         console.log(err);
//         next();
//       });
//   } else {
//     Sessions.get({ hash: req.cookies.shortlyid })
//       .then(result => {
//         if (result) {
//           throw "hash not exists";
//         }
//         req.session = session;
//         next();
//       })
//       .catch(err => {
//         console.log(err);
//         next();
//       });
//   }
// };

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
    })
    // initializes a new session
    .catch(() => {
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie("shortlyid", session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect("/login");
  } else {
    next();
  }
};
