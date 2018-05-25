"use strict";
module.exports = (sequelize, DataTypes) => {
  var Synth = sequelize.define(
    "Synth",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {}
  );
  Synth.associate = function(models) {
    // associations can be defined here
  };
  return Synth;
};
