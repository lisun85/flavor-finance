"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrizeStrategyContract = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Web3 = require('web3');

var fs = require('fs');

var transactionCount = -1;

var getPrizeStrategyContract = function getPrizeStrategyContract() {
  var web3 = _web3();

  var signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.ETH_PRIVATE_KEY);
  var PrizeStrategyContractAddress = '0x6F5587E191C8b222F634C78111F97c4851663ba4';
  var PrizeStrategyContract = JSON.parse(fs.readFileSync('./contracts/FlavorPrizeStrategy.json', 'utf8'));
  var PrizeStrategyContractABI = PrizeStrategyContract['abi'];
  return new web3.eth.Contract(PrizeStrategyContractABI, PrizeStrategyContractAddress, {
    from: signingAccount.address,
    gas: '1500000',
    gasPrice: 20000000000
  });
};

exports.getPrizeStrategyContract = getPrizeStrategyContract;

var _web3 = () => {
  var infuraSubdomain = process.env.NODE_ENV === 'production' ? 'mainnet' : 'ropsten';
  return new Web3("https://".concat(infuraSubdomain, ".infura.io/v3/").concat(process.env.INFURA_KEY));
};

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