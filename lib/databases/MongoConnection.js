const Mongo = require("mongodb");

module.exports = function(storeName) {
  return new Promise((resolve, reject) => {
    Mongo.MongoClient.connect(
      `mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
      .then(client => {
        resolve({ db: client.db(storeName), client: client });
      })
      .catch(error => {
        reject(error);
      });
  });
};
