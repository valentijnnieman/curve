const User = require("../models").User;

module.exports = {
  create(req, res) {
    return User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
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
