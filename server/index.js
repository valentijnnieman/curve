const express = require("express");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const path = require("path");
const cluster = require("cluster");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
// const session = require("express-session");
const cookieSession = require("cookie-session");

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

  // app.use(require("morgan")("combined"));
  // app.use(require("cookie-parser")("curve-dev-secret"));
  app.use(bodyParser.json());
  // app.use(
  //   session({
  //     secret: "curve-dev-secret",
  //     resave: false,
  //     saveUninitialized: true
  //   })
  // );
  app.use(
    cookieSession({
      name: "session",
      keys: ["curve-dev-secret"],
      maxAge: 24 * 60 * 60 * 1000 // 24hours
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(
    new Strategy({ usernameField: "name", passwordField: "password" }, function(
      name,
      password,
      done
    ) {
      User.findOne({ where: { name: name } }).then(user => {
        if (!user) {
          console.log("No user found!");
          return done(null, false, { message: "Incorrect username." });
        }
        if (password == user.password) {
          console.log("Found user, returning.");
          return done(null, user);
        } else return done(null, false, { message: "Incorrect password." });
      });
    })
  );
  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, done) {
    console.log("[[[ SERIALIZING USER ]]]]: ", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("[[[ DE-SERIALIZING USER ]]]]: ", id);
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

  app.post("/api/register", require("./controllers/user").create);

  app.get("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user", ensureAuthenticated, function(req, res) {
    console.log("req.user.id: ", req.user.id);
    User.findByPk(req.user.id)
      .then(user => res.status(201).send({ name: user.name }))
      .catch(error => res.status(400).send(error));
  });

  // Create synth route
  app.post(
    "/api/synth/create",
    ensureAuthenticated,
    require("./controllers/synth").create
  );

  // Get synth route
  app.get("/api/synth/:name", require("./controllers/synth").query);

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
    console.log(req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized session!");
    // res.redirect("/login");
  }
}
