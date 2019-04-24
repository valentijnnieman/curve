const express = require("express");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const path = require("path");
const cluster = require("cluster");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { check } = require("express-validator/check");

const User = require("./models").User;

const numCPUs = require("os").cpus().length;

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${
        worker.process.pid
      } exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  app.use(require("morgan")("combined"));
  app.use(bodyParser.json());
  const session_key =
    process.env.NODE_ENV === "production"
      ? process.env.curve_session_key
      : "curve-local-key";

  app.use(
    cookieSession({
      name: "session",
      keys: [session_key],
      maxAge: 24 * 60 * 60 * 1000 // 24hours
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(
      { usernameField: "name", passwordField: "password" },
      require("./controllers/user").authenticate
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(done);
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

  app.get("/health", function(req, res) {
    res.status(200).send("All systems operational!");
  });

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.status(201).send({ name: req.user.name });
  });

  app.post(
    "/api/register",
    [
      check("name")
        .isLength({ min: 3 })
        .trim()
        .escape(),
      check("password")
        .isLength({ min: 8 })
        .trim()
        .escape()
    ],
    require("./controllers/user").create
  );

  app.get("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user", ensureAuthenticated, function(req, res) {
    User.findByPk(req.user.id)
      .then(user => res.status(201).send({ name: user.name, id: user.id }))
      .catch(error => res.status(400).send(error));
  });

  // Create synth route
  app.post(
    "/api/synth/create",
    ensureAuthenticated,
    [
      check("name")
        .trim()
        .escape()
    ],
    require("./controllers/synth").create
  );

  // Get synth route
  app.get("/api/synth/:name", require("./controllers/synth").query);

  // Get all synths for users route
  app.get("/api/synths/:id", require("./controllers/synth").queryAll);

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function(request, response) {
    response.sendFile(
      path.resolve(__dirname, "../react-ui/build", "index.html")
    );
  });

  app.listen(PORT, function() {
    console.error(
      `Node cluster worker ${process.pid}: listening on port ${PORT}`
    );
  });

  // Authentication middleware
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized session!");
  }
}
