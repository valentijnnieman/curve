const Synth = require("../models").Synth;

const kebabCase = string =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Synth.create({
      name: req.body.name,
      slug: kebabCase(req.body.name),
      data: req.body.data
    })
      .then(synth => res.status(201).send(synth))
      .catch(error => res.status(400).send(error));
  },
  query(req, res) {
    return Synth.findAll({
      where: {
        slug: req.params.name
      }
    })
      .then(synth => {
        if (!synth) {
          res.status(404).send({
            message: "No synth found by this name."
          });
        }
        res.status(200).send(synth);
      })
      .catch(error => res.status(400).send(error));
  }
};
