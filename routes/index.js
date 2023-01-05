const { response } = require("express");
const e = require("express");
var express = require("express");
var router = express.Router();
const session = require("express-session");
var MongoClient = require("mongodb").MongoClient;
var connection = require("../config/mongo-connection");
const { doSearch } = require("../helpers/user-helpers");
const userHelpers = require("../helpers/user-helpers");

let num=3.14;

let x = num;

router.get("/", (req, res) => {
  let err = req.session.userLoginError;
  if (req.session.userLoggedIn) {
    res.redirect("index");
  } else {
    req.session.userLoginError=""
    res.render("login", { err });  
  }
});
router.get("/index", (req, res) => {
  if (req.session.userLoggedIn) {
    let user = req.session.user;
    res.render("index", { user });
  } else {
    res.redirect("/");
  }
});

router.get("/signup", (req, res, next) => {
  let errMsg = req.session.signErr;
  if (req.session.userLoggedIn) {
    res.render("/");
  } else {
    req.session.signErr = null;
    res.render("signup", { errMsg });
  }
});

router.post("/log", function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      res.redirect("index");
    } else {
      req.session.userLoginError = "Incorrect username or password try again";
      res.redirect("/");
    }
  });
});

router.post("/submit", function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    req.session.userLoggedIn = true;
    req.session.user = response;
  });
  res.redirect("/");
});

router.get("/signout", (req, res) => {
  req.session.userLoggedIn = false;
  res.redirect("/");
});

router.get("/admin", (req, res, next) => {
  if (req.session.adminLoggedIn == true) {
    userHelpers.getUsers().then((users) => {
      res.render("admin", { users });
    });
  } else {
    res.redirect("/admin-login");
  }
});

router.get("/admin-login", (req, res, next) => {
  let err = req.session.adminLoginError;
  if (req.session.adminLoggedIn == true) {
    res.redirect("admin");
  } else {
    req.session.adminLoginError = null;
    res.render("admin-login", { err });
  }
});

router.get("/admin-signOut", (req, res) => {
  // req.session.adminsession = false;
  req.session.adminLoggedIn = false;
  res.redirect("/");
});

router.post("/admin-verify", (req, res) => {
  if (req.body.uname === "admin" && req.body.password === "123456") {
    req.session.adminsession = req.body.uname;
    req.session.adminLoggedIn = true;
    res.redirect("admin");
  } else {
    req.session.adminLoginError = "Incorrect username or password try again";
    res.redirect("admin-login");
  }
});

router.get("/add-user", (req, res) => {
  res.render("add-user");
});

router.post("/add-user", (req, res) => {
  userHelpers.addUser(req.body).then(() => {
    res.redirect("/admin");
  });
});

router.get("/delete-user/", (req, res) => {
  let userId = req.query.id;
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect("/admin");
  });
});

router.get("/edit-user/", async (req, res) => {
  let user = await userHelpers.getUser(req.query.id);
  res.render("edit-user", { user });
});

router.post("/edit-user/", async (req, res) => {
  userHelpers.editUser(req.query.id, req.body).then(() => {
    res.redirect("/admin");
  });
});

router.get("/search", async (req, res) => {
  console.log("query " + req.query.usname);
  doSearch(req.query).then((users)=>{
    console.log();
    res.render("admin", {users,
      message: users.length > 0 ? null : "No users found",
    });
  });
});

module.exports = router;

