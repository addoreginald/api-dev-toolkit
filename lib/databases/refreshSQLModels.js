"use-strict";

// get dependency
const SequelizeAuto = require("sequelize-auto");

/**
 * This function refreshes specified sequelize models
 * @param {*} options
 * @param {*} tables
 */

function refreshModels(options, tables) {
  try {
    // Show begin logs
    console.log("Refresh process started");

    // init default settings
    const databaseOptions = {
      host: options.host,
      dialect: options.dialect,
      directory: "models",
      port: options.port,
      additional: {
        timestamps: false
      },
      dialectOptions: {
        encrypt: options.ssl,
        requestTimeout: 300000
      },
      tables: tables
    };

    // instanciate instance variable
    const instance = new SequelizeAuto(
      options.databasename,
      options.username,
      options.password,
      { ...databaseOptions }
    );

    // run
    instance.run(err => {
      // throw error if one occurs
      if (err) throw err;
      // Show successful
      console.log("Refresh process completed");
    });
  } catch (error) {
    throw error;
  }
}

module.exports = refreshModels;
