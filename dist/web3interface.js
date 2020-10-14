"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPodContract = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Web3 = require('web3');

var fs = require('fs');

var transactionCount = -1;

var getPodContract = function getPodContract() {
  var signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.ETH_PRIVATE_KEY);
  var web3 = new Web3('https://ropsten.infura.io/v3/' + process.env.INFURA_KEY);
  var PodContractAddress = '0x...';
  var PodContract = JSON.parse(fs.readFileSync('./contracts/FlavorPod.json', 'utf8'));
  var PodContractABI = PodContract['abi'];
  return new web3.eth.Contract(PodContractABI, PodContractAddress, {
    from: signingAccount.address,
    gas: '1500000',
    gasPrice: 20000000000
  });
};

exports.getPodContract = getPodContract;

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