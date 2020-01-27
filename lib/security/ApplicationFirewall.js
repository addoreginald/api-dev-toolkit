/**
 * Application firewall middleware
 */
const http = require("./../utils/http");
const constants = require("./../utils/constants");
const Sequelize = require("sequelize");
const path = require("path");
const accessKeyContructor = require("./../../models/AccessKeys");
const CRUD = require("./../databases/SQL_CRUD_Opp");

/**
 * Middleware firewall function
 */

module.exports.Middleware = async (req, res, next) => {
  // run checks on application
  try {
    // bootstrap
    const connection = await bootstrap();

    // Process accesskey once bootstrap is done
    const accessKeyEntity = accessKeyContructor(connection, Sequelize);
    let accessKeyInRequest = req.get("Access-Key");

    // get access token in url
    if (typeof accessKeyInRequest === "undefined") {
      accessKeyInRequest =
        typeof req.query.token !== "undefined"
          ? req.query.token
          : req.session.token;
    }

    if (accessKeyInRequest) {
      const CRUD_obj = await CRUD.readSingle(accessKeyEntity, {
        accessKeyValue: accessKeyInRequest
      });

      if (CRUD_obj !== null) {
        const snapshot = CRUD_obj.dataValues;

        if (snapshot.isBlocked === 0) {
          res.locals.accessKeyData = snapshot;
          next();
        } else {
          res.status(401).send(http.unauthorized(constants.ACCESS_KEY_BLOCKED));
        }
      } else {
        res.status(401).send(http.unauthorized(constants.INVALID_ACCESS_KEY));
      }
    } else {
      res.status(401).send(http.unauthorized(constants.ACCESS_KEY_ERROR));
    }
  } catch (error) {
    res
      .status(500)
      .send(http.serverError(error.message, constants.FIREWALL_ERROR));
  }
};

/**
 * Create a new
 */

module.exports.NewAccessKey = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      // bootstrap
      const connection = await bootstrap();

      // Create new access-key
      const accessKeyEntity = accessKeyContructor(connection, Sequelize);
      const CRUD_obj = await CRUD.create(accessKeyEntity, payload);

      resolve(CRUD_obj.dataValues);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.ListAccessKeys = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // bootstrap
      const connection = await bootstrap();

      // Create new access-key
      const accessKeyEntity = accessKeyContructor(connection, Sequelize);
      const CRUD_obj = await CRUD.readMulti(accessKeyEntity, {});
      const results = CRUD_obj.map(e => {
        return e.dataValues;
      });

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.ApplicationNameExists = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      // bootstrap
      const connection = await bootstrap();

      // Create new access-key
      const accessKeyEntity = accessKeyContructor(connection, Sequelize);
      const CRUD_obj = await CRUD.readSingle(accessKeyEntity, {
        applicationAlias: payload
      });

      resolve(CRUD_obj !== null);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Helper functions
 */
const defaultDatabaseLocation = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "database",
  "database.sqlite"
);
// const defaultDatabaseLocation = path.join(
//   __dirname,
//   "..",
//   "..",
//   "database.sqlite"
// );

function bootstrap() {
  return new Promise((resolve, reject) => {
    try {
      // connect to database
      const connection = connectToDatabase();
      resolve(connection);
    } catch (error) {
      reject(error);
    }
  });
}

async function connectToDatabase() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: defaultDatabaseLocation,
    logging: false
  });

  // test connection
  await sequelize.authenticate();

  return sequelize;
}
