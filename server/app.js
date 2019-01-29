const express = require("express");
const path = require("path");
const utils = require("./lib/hashUtils");
const partials = require("express-partials");
const bodyParser = require("body-parser");
const Auth = require("./middleware/auth");
const models = require("./models");

const app = express();

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create", (req, res) => {
  res.render("index");
});

app.get("/links", (req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post("/links", (req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  let { username, password } = req.body;
  return models.Users.get({ username })
    .then(result => {
      if (result) {
        res.status(409).redirect("/signup");
        throw new Error("users already exists");
      }
      return models.Users.create({ username, password });
    })
    .then(success => {
      res.status(201).redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  // let { body } = req;
  let bodyUsername = req.body.username;
  let bodyPassword = req.body.password;
  // body.password or user.password
  return models.Users.get({ username: bodyUsername })
    .then(result => {
      return result;
    })
    .then(user => {
      let userPassword = user.password;
      let salt = user.salt;
      // let { password, salt } = user;
      // console.log("a", password, "p", password);
      if (!user) {
        throw new Error("users does not exists");
      }
      return models.Users.compare(bodyPassword, userPassword, salt);
    })
    .then(success => {
      if (success) {
        res.status(201).redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
    });

  res.send("index");
});

/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get("/:code", (req, res, next) => {
  return models.Links.get({ code: req.params.code })
    .tap(link => {
      if (!link) {
        throw new Error("Link does not exist");
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect("/");
    });
});

module.exports = app;
