"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextNonce = nextNonce;
exports.ExampleContractInstance = exports.ExampleContractAddress = exports.getExampleContract = exports.signingAccount = exports.web3 = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Web3 = require('web3');

var web3 = new Web3('https://ropsten.infura.io/v3/' + process.env.INFURA_KEY);
exports.web3 = web3;
var signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f'); //process.env.ETH_PRIVATE_KEY);

exports.signingAccount = signingAccount;

var fs = require('fs');

var ExampleContractAddress = '0x...';
exports.ExampleContractAddress = ExampleContractAddress;
var ExampleContract = null; //JSON.parse(fs.readFileSync('./contracts/ExampleContract.json', 'utf8'));

var ExampleContractABI = null; //ExampleContract['abi'];

var transactionCount = -1;

var getExampleContract = function getExampleContract(contractAddress) {
  return new web3.eth.Contract(ExampleContractABI, contractAddress, {
    from: signingAccount.address,
    gas: '1500000',
    gasPrice: 20000000000
  });
};

exports.getExampleContract = getExampleContract;
var ExampleContractInstance = null; // const ExampleContractInstance = new web3.eth.Contract(ExampleContractABI, ExampleContractAddress,
// 	{
// 		from: signingAccount.address,
// 		gas: '1500000',
// 		gasPrice: 20000000000,
// 	});

exports.ExampleContractInstance = ExampleContractInstance;

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