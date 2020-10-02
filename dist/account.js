"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccount = getAccount;
exports.updateAccount = updateAccount;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Datastore = require('@google-cloud/datastore');

var web3interface = require('./web3interface');

var web3 = web3interface.web3;
var ProxyWalletABI = web3interface.ProxyWalletABI;
var signingAccount = web3interface.signingAccount;
var FactoryContract = web3interface.FactoryContract;
var FactoryAddress = web3interface.FactoryAddress; // Creates a client

var datastore = new Datastore();

function getAccount(_x) {
  return _getAccount.apply(this, arguments);
}

function _getAccount() {
  _getAccount = _asyncToGenerator(function* (address) {
    var accountKey = datastore.key(['Account', address]);
    return new Promise((resolve, reject) => {
      datastore.get(accountKey).then((results, err) => {
        results ? resolve(results[0]) : reject(err);
      });
    });
  });
  return _getAccount.apply(this, arguments);
}

function updateAccount(_x2, _x3) {
  return _updateAccount.apply(this, arguments);
}

function _updateAccount() {
  _updateAccount = _asyncToGenerator(function* (address, selectedAsset) {
    var accountKey = datastore.key(['Account', address]);
    var entity = {
      key: accountKey,
      data: [{
        name: 'address',
        value: address
      }, {
        name: 'selectedAsset',
        value: selectedAsset
      }]
    };
    yield datastore.save(entity);
    return {
      address,
      selectedAsset
    };
  });
  return _updateAccount.apply(this, arguments);
}
//# sourceMappingURL=account.js.map