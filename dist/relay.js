"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relaySendTransactionMessage = relaySendTransactionMessage;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Datastore = require('@google-cloud/datastore');

var web3interface = require('./web3interface');

var web3 = web3interface.web3;
var ProxyWalletABI = web3interface.ProxyWalletABI;
var signingAccount = web3interface.signingAccount; // Creates a client

var datastore = new Datastore({
  projectId: 'poolside-network',
  keyFilename: 'service_account.json' // service_account.json is not included in git repository

});

function relayMessageSave(_x, _x2, _x3, _x4, _x5, _x6) {
  return _relayMessageSave.apply(this, arguments);
}

function _relayMessageSave() {
  _relayMessageSave = _asyncToGenerator(function* (username, signature, contractAddress, action, params, txHash) {
    var userKey = datastore.key(['User', username]);
    yield datastore.get(userKey).then(results => {
      var entity = results[0];
      entity.txs = entity.txs || [];
      entity.txs.push({
        "action": action,
        "params": params,
        "signature": signature,
        "txHash": txHash
      });
      datastore.upsert(entity).then(() => {
        // Entity updated successfully.
        console.log('successfully saved transaction record for ' + username);
        resolve(entity);
      });
    });
  });
  return _relayMessageSave.apply(this, arguments);
}

;

function relaySendTransactionMessage(_x7, _x8, _x9, _x10, _x11) {
  return _relaySendTransactionMessage.apply(this, arguments);
}

function _relaySendTransactionMessage() {
  _relaySendTransactionMessage = _asyncToGenerator(function* (username, signature, contractAddress, action, txParams) {
    var WalletContract = web3interface.getWalletContract(contractAddress);
    var tx = {
      gas: web3.utils.toHex(3000000),
      to: contractAddress,
      gasPrice: web3.utils.toHex(web3.utils.toBN(txParams.gasPrice)),
      data: WalletContract.methods.sendTransaction(txParams.nonce, txParams.gasPrice, txParams.gasLimit, txParams.to, txParams.value, txParams.data, signature).encodeABI()
    };
    var signedTx = yield signingAccount.signTransaction(tx);
    console.log("Sending Raw Transaction: " + signedTx.rawTransaction);
    var receipt = yield new Promise(function (resolve, reject) {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction).once('receipt', function (receipt) {
        resolve(receipt);
      }).on('transactionHash', console.log).on('error', reject);
    });
    return {
      "receipt": receipt
    };
  });
  return _relaySendTransactionMessage.apply(this, arguments);
}
//# sourceMappingURL=relay.js.map