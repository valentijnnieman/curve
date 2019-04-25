const User = require("../models").User;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator/check");

class UserController {
  static create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send(errors.array()[0].message);
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    return User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  }
  static query(req, res) {
    return User.findByPk(req.user.id)
      .then(user => res.status(201).send({ name: user.name, id: user.id }))
      .catch(error => res.status(400).send(error));
  }
  static authenticate(name, password, done) {
    User.findOne({ where: { name: name } }).then(user => {
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else return done(null, false, { message: "Incorrect password." });
    });
  }
  static update(req, res) {
    return User.update({ ...req.body }, { where: { id: req.body.id } })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  }
  static delete(req, res) {
    return User.destroy({ where: { id: req.body.id } })
      .then(response => res.status(200).send(response))
      .catch(error => res.status(400).send(error));
  }
}

module.exports = UserController;
