var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/walletDatabase";


var storeAccount = function(user, contractAddress) {
  return new Promise(function(res, err) {
    MongoClient.connect(url, function(db_error, db) {
      var accountInfo = {
        userAddress: user.address,
        contractAddress: contractAddress,
        setTrustees: false
      };
      db.collection('users').insertOne(accountInfo);
      db.close();
      res(accountInfo);
    });
  });
}

var getAccount = function(user) {
  return new Promise(function(res, err) {
    MongoClient.connect(url, function(err, db) {
      var query = {userAddress: user.address};
      db.collection('users').findOne(query).then(function(queryResult) {
        if (queryResult) {
          res(queryResult);
        } else {
          res(false);
        }
      });
    });
  })
}

var setTrusteesTrue = function(userInfo) {
  MongoClient.connect(url, function(err, db) {
      var query = { userAddress: userInfo.address };
      db.collection('users').findOne(query).then(function(result) {
        result.setTrustees = true;
        db.collection('users').update(query, result);
      });
  });
}

module.exports = {
  storeAccount: storeAccount, 
  getAccount: getAccount,
  setTrusteesTrue: setTrusteesTrue
};

