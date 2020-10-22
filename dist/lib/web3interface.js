"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrizeStrategyContract = exports._Web3 = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Web3 = require('web3');

var fs = require('fs');

var transactionCount = -1;

var _Web3 = () => {
  var infuraSubdomain = process.env.NODE_ENV === 'production' ? 'mainnet' : 'ropsten';
  var web3 = new Web3("https://".concat(infuraSubdomain, ".infura.io/v3/").concat(process.env.INFURA_KEY));
  var signingAccount = web3.eth.accounts.privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
  web3.eth.accounts.wallet.add(signingAccount);
  web3.eth.defaultAccount = signingAccount.address;
  return web3;
};

exports._Web3 = _Web3;

var getPrizeStrategyContract = web3 => {
  var PrizeStrategyContractAddress = '0x6F5587E191C8b222F634C78111F97c4851663ba4';
  var PrizeStrategyContractABI = JSON.parse(fs.readFileSync('./contracts/PeriodicPrizeStrategy.json', 'utf8'));
  return new web3.eth.Contract(PrizeStrategyContractABI, PrizeStrategyContractAddress);
};

exports.getPrizeStrategyContract = getPrizeStrategyContract;

function nextNonce() {
  return _nextNonce.apply(this, arguments);
}

function _nextNonce() {
  _nextNonce = _asyncToGenerator(function* () {
    if (transactionCount < 0) {
      transactionCount = yield web3.eth.getTransactionCount(signingAccount.address, "pending");
    }

    return transactionCount++;
  });
  return _nextNonce.apply(this, arguments);
}
//# sourceMappingURL=web3interface.js.map