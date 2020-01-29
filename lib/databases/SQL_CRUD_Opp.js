// Dependencies
const Sequelize = require("sequelize");

/**
 * create user record from an entity
 * @param {*} entity
 * @param {*} res
 * @param {*} payload
 */
module.exports.create = async (entity, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const timestamp = new Date();

      // Run  creation process
      const process00 = await entity.create({
        ...payload,
        created_at: timestamp,
        updated_at: timestamp,
        soft_delete: 0
      });

      resolve(process00);
    } catch (error) {
      // Output error to user
      reject(error);
    }
  });
};

/**
 * Read a single record from an entity
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */

module.exports.readSingle = async (entity, condition) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Run find one process
      const process00 = await entity.findOne({
        attributes: {
          exclude: ["soft_delete", "created_at", "updated_at"]
        },
        where: { ...condition, soft_delete: 0 }
      });

      resolve(process00);
    } catch (error) {
      // Output error to user
      reject(error);
    }
  });
};

/**
 * Loose search using one custom parameter
 * @param {*} res
 * @param {*} entity
 * @param {*} req
 */

module.exports.looseSearch = async (entity, req) => {
  return new Promise(async (resolve, reject) => {
    // Get query param
    const param = Object.keys(req.body.like)[0];

    // init search param obj
    const paramBuild = {};

    // Build search param obj
    paramBuild[`${param}`] = {
      [Sequelize.Op.like]: `%${req.body.like[Object.keys(req.body.like)[0]]}%`
    };

    try {
      // run find all with pagination
      const process00 = await entity.findAll({
        attributes: {
          exclude: ["soft_delete", "created_at", "updated_at"]
        },
        where: { ...paramBuild, ...req.body.filter, soft_delete: 0 }
      });

      resolve(process00);
    } catch (error) {
      // Output error to client
      reject([]);
    }
  });
};

/**
 * Search using custom parameters
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */

module.exports.search = async (entity, req) => {
  return new Promise(async (resolve, reject) => {
    // check for pagination parameters
    if (req.$limit) {
      try {
        let page, limit, offset, totalPages, currentPage;

        // Cast to number
        limit = Math.abs(Number.parseInt(req.$limit));
        page = Math.abs(Number.parseInt(req.$page));
        o_page = page <= 0 ? 0 : page - 1;

        // Calculate offset
        offset = limit * o_page;

        // run find all with pagination
        const process00 = await entity.findAndCountAll({
          attributes: {
            exclude: ["soft_delete", "created_at", "updated_at"]
          },
          where: { ...req, soft_delete: 0 },
          limit: limit,
          offset: offset
        });

        // Calculate pagination meta
        totalPages = Math.ceil(process00.count / limit);
        currentPage = page === 0 ? 1 : page;

        resolve({
          total: process00.count,
          pages: totalPages,
          current_page: currentPage,
          next_page: currentPage >= totalPages ? null : currentPage + 1,
          prev_page: currentPage === 1 ? null : currentPage - 1,
          data: process00.rows
        });
      } catch (error) {
        // Output error to client
        reject(error);
      }
    } else {
      try {
        // remove any occurance of pagination
        if (req.$page) {
          delete req.$page;
        }

        // run find all with pagination
        const process00 = await entity.findAll({
          attributes: {
            exclude: ["soft_delete", "created_at", "updated_at"]
          },
          where: { ...req, soft_delete: 0 }
        });

        resolve(process00);
      } catch (error) {
        // Output error to client
        reject(error);
      }
    }
  });
};

/**
 * Count using custom parameters
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */

module.exports.count = async (entity, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      // run find all with pagination
      const process00 = await entity.count({
        where: { ...req, soft_delete: 0 }
      });

      resolve(process00);
    } catch (error) {
      // Output error to client
      reject(error);
    }
  });
};

/**
 * Read multitle records form an entity
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */
module.exports.readMulti = async (entity, req) => {
  return new Promise(async (resolve, reject) => {
    // check for pagination parameters
    if (req.$limit) {
      try {
        let page, limit, offset, totalPages, currentPage;

        // Cast to number
        limit = Math.abs(Number.parseInt(req.$limit));
        page = Math.abs(Number.parseInt(req.$page));
        o_page = page <= 0 ? 0 : page - 1;

        // Calculate offset
        offset = limit * o_page;

        // delete limit and page
        // delete req.$limit;
        // delete req.$page;

        // run find all with pagination
        const process00 = await entity.findAndCountAll({
          attributes: {
            exclude: ["soft_delete", "created_at", "updated_at"]
          },
          where: { soft_delete: 0 },
          limit: limit,
          offset: offset
        });

        // Calculate pagination meta
        totalPages = Math.ceil(process00.count / limit);
        currentPage = page === 0 ? 1 : page;

        resolve({
          total: process00.count,
          pages: totalPages,
          current_page: currentPage,
          next_page: currentPage >= totalPages ? null : currentPage + 1,
          prev_page: currentPage === 1 ? null : currentPage - 1,
          data: process00.rows
        });
      } catch (error) {
        // Output error to client
        reject(error);
      }
    } else {
      try {
        // remove any occurance of pagination
        if (req.$page) {
          delete req.$page;
        }

        // run find all with pagination
        const process00 = await entity.findAll({
          attributes: {
            exclude: ["soft_delete", "created_at", "updated_at"]
          },
          where: { ...req, soft_delete: 0 }
        });

        resolve(process00);
      } catch (error) {
        // Output error to client
        reject(error);
      }
    }
  });
};

/**
 * Update a single record in an entity
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */

module.exports.update = async (entity, payload, condition) => {
  return new Promise(async (resolve, reject) => {
    try {
      const timestamp = new Date();

      // Update found record
      const process01 = await entity.update(
        {
          ...payload,
          updated_at: timestamp
        },
        { where: condition }
      );

      // Find record with ID
      const process00 = await entity.findOne({ where: condition });

      resolve(process00);
    } catch (error) {
      // Output error to client
      reject(error);
    }
  });
};

/**
 * Soft delete a single record from an entity
 * @param {*} token
 * @param {*} entity
 * @param {*} req
 */

module.exports.remove = async (entity, condition) => {
  return new Promise(async (resolve, reject) => {
    try {
      const timestamp = new Date();

      // find record with id
      const process00 = await entity.update(
        { soft_delete: 1, updated_at: timestamp },
        { where: condition }
      );

      // Find record with ID
      const process01 = await entity.findOne({ where: condition });

      resolve(process01);
    } catch (error) {
      // Output error to client
      reject(error);
    }
  });
};
