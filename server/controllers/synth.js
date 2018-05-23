const Synth = require("../models").Synth;

module.exports = {
  create(req, res) {
    return Synth.create({
      name: req.body.name,
      data: req.body.data
    })
      .then(synth => res.status(201).send(synth))
      .catch(error => res.status(400).send(error));
  },
  query(req, res) {
    console.log("wanna queryyyy");
    return Synth.findAll({
      where: {
        name: req.params.name
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
