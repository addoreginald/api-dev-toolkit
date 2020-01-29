const Utils = require("./../utils/http");
const jwt = require("jsonwebtoken");

module.exports.checkForAuthorizationHeader = (req, res, next) => {
  const header = req.get("Authorization");

  if (typeof header === "undefined") {
    res.status(401).send(Utils.unauthorized());
  } else {
    try {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

      // insert into locals
      res.locals.principal = decoded;
      next();
    } catch (error) {
      if (error.message === "invalid signature") {
        res.status(401).send(Utils.unauthorized());
      } else {
        res.status(500).send(Utils.serverError(error.message));
      }
    }
  }
};

module.exports.createPrincipal = payload => {
  return jwt.sign(payload, process.env.PRIVATE_KEY);
};
