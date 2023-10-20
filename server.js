require("dotenv").config;
const express = require("express");
const passport = require("passport");
const session = require("express-session");
require("./passport");

const app = express();
const port = 3000;

app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/home", (req, res) => {
  res.send("Home Page");
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/success");
  }
);

app.get("/failed", (req, res) => {
  console.log("User is not authenticated");
  res.send("Failed");
});

app.get("/success", isLoggedIn, (req, res) => {
  console.log("Your are logged in");
  res.send(`Welcome ${req.user.displayName}`);
});

app.get("logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error while destroying session:", err);
    } else {
      req.logout(() => {
        console.log("You are logged out");
        res.redirect("/home");
      });
    }
  });
});

app.listen(port, () => console.log("server running on port " + port))
