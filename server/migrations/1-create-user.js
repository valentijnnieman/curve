"use strict";

var Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 * createTable "Synths", deps: [Users]
 *
 **/

var info = {
  revision: 1,
  name: "create-user",
  created: "2019-04-21T18:23:28.961Z",
  comment: ""
};

var migrationCommands = [
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          field: "name",
          unique: true,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          field: "email",
          validate: {
            isEmail: true
          },
          unique: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt"
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt"
        }
      },
      {}
    ]
  },
  {
    fn: "createTable",
    params: [
      "Synths",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          field: "name",
          unique: true,
          allowNull: false
        },
        slug: {
          type: Sequelize.STRING,
          field: "slug",
          unique: true,
          allowNull: false
        },
        data: {
          type: Sequelize.JSON,
          field: "data",
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: {
            model: "Users",
            key: "id"
          }
        }
      },
      {}
    ]
  }
];

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn]
            .apply(queryInterface, command.params)
            .then(next, reject);
        } else resolve();
      }
      next();
    });
  },
  info: info
};
