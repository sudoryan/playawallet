var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var connect = require('connect');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var Web3 = require('web3');
var multiSigContract = require('./MultiSig.json');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/walletDatabase";
var session = require('express-session');
var login = require('./login');
var contract = require('./contract');

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true
}));

// rpc start
// geth --rpcapi eth,web3,personal --rpc
// mongo walletDatabase --eval "db.dropDatabase()"

app.use(function(req, res, next) {
  console.log('Logging...');
  next();
});

//Sass Middleware
app.use(sassMiddleware({
  src: '/stylesheets',
  force: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  req.session.destroy();
  res.render('index');
});

// Login
app.post('/', function(req, res) {
  login(req, res);
})

app.get('/setTrustees', function(req, res) {
  if (!req.session.userInfo || !req.session.contractAddress) {
    res.redirect('/');
  } else {
    res.render('setTrustees', {accountCreated: req.session.accountCreated});
  }
});

app.post('/setTrustees', function(req, res) {
  contract.setTrustees(
    req.session,
    req.body.trusteeOneAddress, 
    req.body.trusteeTwoAddress
    );
  if (req.session.accountCreated) {
    res.redirect('/addFunds');
  } else {
    res.redirect('/wallet')
  }
});

app.get('/wallet', function(req, res) {
  if (!req.session.userInfo || !req.session.contractAddress) {
    res.redirect('/');
  } else {
    req.session.accountCreated = false;
    let accountBalance = contract.getBalance(req.session.userInfo.address);
    res.render('wallet', {
      address: req.session.userInfo.address,
      walletBalance: contract.getBalance(req.session.contractAddress),
      setTrustees: req.session.setTrustees
    });
  }
});

app.post('/wallet', function(req, res) {
  contract.transfer(req)
    .then(function(walletBalance) {
      res.render('wallet', {
        value: req.body.amountToSend, 
        address: req.session.userInfo.address,
        walletBalance: walletBalance,
        setTrustees: req.session.setTrustees
      })
    })
    .catch(function(walletBalance) {
      res.render('wallet', {
        error: 1,
        address: req.session.userInfo.address,
        walletBalance: walletBalance,
        setTrustees: req.session.setTrustees
    });
  });
});

app.get('/addFunds', function(req, res) {
  if (!req.session.userInfo || !req.session.contractAddress) {
    res.redirect('/');
  } else {
    let walletBalance = contract.getBalance(req.session.contractAddress);
      res.render('addFunds', {
        walletBalance: walletBalance,
        accountCreated: req.session.accountCreated
      });
    }
});

app.post('/addFunds', function(req, res) {
  contract.addFunds(req);
  if (req.session.accountCreated) {
    req.session.accountCreated = false;
    res.redirect('wallet');
  } else {
    res.redirect('addFunds');
  }
});

app.listen(3000, function() {
  console.log('Server started on port 3000');
});