var multiSigContract = require('./MultiSig.json');
var Web3 = require('web3');
var db = require('./db');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

var deploy = function(user) {
  return new Promise(function(res, err) {
    let abi = multiSigContract[0].abi;
    let bytecode = multiSigContract[0].unlinked_binary;
    let gasEstimate = web3.eth.estimateGas({data: bytecode});
    let newContract = web3.eth.contract(abi);
  
    newContract.new({
      from: user.address, 
      data: bytecode, 
      gas: gasEstimate
    }, function(error, retContract) {
      // Callback fires twice
      if(!error) {
        if (!retContract.transactionHash && !retContract.address) {
          err(false);
        }
        if(retContract.address) {
          res(retContract.address);
        }
      } else {
        err('errr');
      }
    })
  });
}

var getBalance = function(address) {
  let balance = web3.eth.getBalance(address);
  return (balance);
}

var transfer = function(req) {
  return new Promise(function(res, err) {
    let contractInstance = getInstance(req.session.contractAddress);
    let walletBalance = getBalance(req.session.contractAddress);
    if (walletBalance >= req.body.amountToSend) {
      contractInstance.transfer(
        req.body.sendToAddress, 
        req.body.amountToSend, {
        from: req.session.userInfo.address
      })
      res(walletBalance - req.body.amountToSend);
    } else {
      err(walletBalance);
    }
  });
}

var getInstance = function(contractAddress) {
  return web3.eth.contract(multiSigContract[0].abi).at(contractAddress);
}

var setTrustees = function(session, trusteeOne, trusteeTwo) {
  let contractInstance = getInstance(session.contractAddress);
  var ret = contractInstance.setTrustees(trusteeOne, trusteeTwo, {
    from: session.userInfo.address
  });
  db.setTrusteesTrue(session.userInfo);
  session.setTrustees = true;
}

var addFunds = function(req) {
  web3.eth.sendTransaction({
    to: req.session.contractAddress, 
    from: req.session.userInfo.address, 
    value: req.body.transferAmount
  });
}

module.exports = {
  deploy: deploy,
  getBalance: getBalance,
  transfer: transfer,
  setTrustees: setTrustees,
  getInstance: getInstance,
  addFunds: addFunds
};