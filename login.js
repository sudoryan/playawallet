var db = require('./db');
var contract = require('./contract');
var Wallet = require('ethereumjs-wallet');

var createUserFromPrivateKey = function(privateKey) {
  return new Promise(function(res, err) {
    if (privateKey.substring(0,2) == '0x') {
      privateKey = privateKey.slice(2);
    }
    privateKey = new Buffer(privateKey, 'hex');
    try {
      var wallet = Wallet.fromPrivateKey(privateKey);
      privateKey = wallet.getPrivateKeyString(privateKey);
      user = {
        privateKey: privateKey, 
        address: wallet.getAddressString()
      };
      res(user);
    }
    catch (e) {
      err(1);
    }    
  })
}

var createAccount = function(user) {
  return contract.deploy(user)
  .then(function(contractAddress) {
    return db.storeAccount(user, contractAddress);
  });
}

var storeInfoInSession = function(req, accountInfo, user, callback) {
  req.session.contractAddress = accountInfo.contractAddress;
  req.session.setTrustees = accountInfo.setTrustees;
  req.session.userInfo = user;
  callback();
}

var login = function(req, res) {
  req.session.contractAddress = null;
  req.session.userInfo = null;
  req.session.accountCreated = false;

  createUserFromPrivateKey(req.body.privateKey)
    .then(function(user) {
      return db.getAccount(user);
    })
    .then(function(accountInfo) {
      if (accountInfo) {
        storeInfoInSession(req, accountInfo, user, function() {
          res.redirect('/wallet');
        });
      } else {
        createAccount(user)
          .then(function(accountInfo) {
            storeInfoInSession(req, accountInfo, user, function() {
              req.session.accountCreated = true;
              res.redirect('/setTrustees');            
            });
        });
      }
    })
    .catch(function(error) {
      res.render('index', {error: error});
    });
}

module.exports = login;