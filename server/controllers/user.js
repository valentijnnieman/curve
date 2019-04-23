const User = require("../models").User;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator/check");

module.exports = {
  create(req, res) {
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
  },
  query(req, res) {
    return User.findAll({
      where: {
        email: req.params.email
      }
    })
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: "No user found with this email."
          });
        }
        res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  }
};
