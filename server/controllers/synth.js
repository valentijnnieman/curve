const Synth = require("../models").Synth;

const kebabCase = str => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
  return str;
};

class SynthController {
  static create(req, res) {
    return Synth.create({
      name: req.body.name,
      slug: kebabCase(req.body.name),
      data: req.body.data,
      userId: req.body.userId
    })
      .then(synth => res.status(201).send(synth))
      .catch(error => res.status(400).send(error));
  }
  static query(req, res) {
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
  static queryAll(req, res) {
    return Synth.findAll({
      where: {
        userId: req.params.id
      }
    })
      .then(synths => {
        if (!synths || synths.length < 1) {
          res.status(404).send({
            message: "No synths found for this user."
          });
        } else {
          res.status(200).send(synths);
        }
      })
      .catch(error => res.status(400).send(error));
  }
  static update(req, res) {
    return Synth.update({ ...req.body }, { where: { id: req.body.id } })
      .then(synth => res.status(200).send(synth))
      .catch(error => res.status(400).send(error));
  }
  static delete(req, res) {
    return Synth.destroy({ where: { id: req.body.id } })
      .then(response => res.status(200).send(response))
      .catch(error => res.status(400).send(error));
  }
}

module.exports = SynthController;
