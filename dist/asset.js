"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startPrizePeriod = startPrizePeriod;
exports.endPrizePeriod = endPrizePeriod;
exports.updateAssetPrices = updateAssetPrices;
exports.getAssetPrices = getAssetPrices;
exports.calculateWinner = calculateWinner;
exports.getHistory = getHistory;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var coinmarketcap = require('./lib/coinmarketcap');

var Datastore = require('@google-cloud/datastore');

var datastore = new Datastore();
var ASSETS = ["BTC", "ETH", "LINK"];

function endPrizePeriod() {
  return _endPrizePeriod.apply(this, arguments);
}

function _endPrizePeriod() {
  _endPrizePeriod = _asyncToGenerator(function* () {
    // TODO: call completeAward method on prize strategy contract
    //await completeAward();
    var winner = yield calculateWinner();
    saveWinner(winner); // TODO: replace this with event so it will always be onchain result
  });
  return _endPrizePeriod.apply(this, arguments);
}

function completeAward() {
  return _completeAward.apply(this, arguments);
}

function _completeAward() {
  _completeAward = _asyncToGenerator(function* () {
    var podContract = web3interface.getPodContract();
    podContract.methods.completeAward().send({
      from: process.env.ETH_SIGNING_ACCOUNT,
      gas: '1500000'
    }, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (error, txHash) {
        if (error) {
          //onTxHash && onTxHash('')
          console.log("Depositing error", error);
          return false;
        }
      });

      return function (_x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  });
  return _completeAward.apply(this, arguments);
}

function calculateWinner() {
  return _calculateWinner.apply(this, arguments);
}

function _calculateWinner() {
  _calculateWinner = _asyncToGenerator(function* () {
    var [assetPrices] = yield datastore.runQuery(datastore.createQuery('AssetPrice'));
    assetPrices.sort((a, b) => b.percentChange - a.percentChange);
    var winner = assetPrices[0];
    console.log('winner', winner);
    return winner;
  });
  return _calculateWinner.apply(this, arguments);
}

function saveWinner(_x) {
  return _saveWinner.apply(this, arguments);
}

function _saveWinner() {
  _saveWinner = _asyncToGenerator(function* (winner) {
    var today = new Date().toISOString().slice(0, 10);
    var winnerKey = datastore.key(['PrizePeriodHistory', today]);
    var entity = {
      key: winnerKey,
      data: [{
        name: 'date',
        value: today
      }, {
        name: 'asset',
        value: winner.asset
      }, {
        name: 'prizePeriodStartPrice',
        value: winner.prizePeriodStartPrice
      }, {
        name: 'latestPrice',
        value: winner.latestPrice
      }, {
        name: 'percentChange',
        value: winner.percentChange
      }]
    };
    yield datastore.save(entity);
    return {
      winner
    };
  });
  return _saveWinner.apply(this, arguments);
}

function startPrizePeriod() {
  return _startPrizePeriod.apply(this, arguments);
}

function _startPrizePeriod() {
  _startPrizePeriod = _asyncToGenerator(function* () {
    var assetPrices = yield coinmarketcap.fetchAssetPrices(ASSETS);
    var entities = [];
    var assetDataResults = [];
    ASSETS.forEach((asset, index) => {
      var assetKey = datastore.key(['AssetPrice', asset]);
      var assetData = [{
        name: 'asset',
        value: asset
      }, {
        name: 'prizePeriodStartPrice',
        value: assetPrices[asset]
      }, {
        name: 'latestPrice',
        value: assetPrices[asset]
      }, {
        name: 'percentChange',
        value: 0
      }];
      assetDataResults.push(assetData);
      entities.push({
        key: assetKey,
        data: assetData
      });
    });
    yield datastore.upsert(entities);
    return {
      assetDataResults
    };
  });
  return _startPrizePeriod.apply(this, arguments);
}

function _getAssetEntities() {
  return _getAssetEntities2.apply(this, arguments);
}

function _getAssetEntities2() {
  _getAssetEntities2 = _asyncToGenerator(function* () {
    var assetKeys = ASSETS.map(asset => datastore.key(['AssetPrice', asset]));
    return new Promise((resolve, reject) => {
      datastore.get(assetKeys).then((results, err) => {
        results ? resolve(results) : reject(err);
      });
    });
  });
  return _getAssetEntities2.apply(this, arguments);
}

function _percentChange(startPrice, latestPrice) {
  var priceDiff = latestPrice - startPrice;
  return priceDiff / startPrice * 100;
}

function updateAssetPrices() {
  return _updateAssetPrices.apply(this, arguments);
}

function _updateAssetPrices() {
  _updateAssetPrices = _asyncToGenerator(function* () {
    var assetEntities = yield _getAssetEntities();
    var assetPrices = yield coinmarketcap.fetchAssetPrices(ASSETS);
    var entities = [];
    var assetDataResults = [];
    assetEntities[0].forEach((assetEntity, index) => {
      var latestPrice = assetPrices[assetEntity.asset];
      console.log("latest price for ".concat(assetEntity.asset, " is ").concat(latestPrice));
      var assetKey = datastore.key(['AssetPrice', assetEntity.asset]);
      var assetData = [{
        name: 'asset',
        value: assetEntity.asset
      }, {
        name: 'prizePeriodStartPrice',
        value: assetEntity.prizePeriodStartPrice
      }, {
        name: 'latestPrice',
        value: latestPrice
      }, {
        name: 'percentChange',
        value: _percentChange(assetEntity.prizePeriodStartPrice, latestPrice)
      }]; //console.log(assetEntity, assetData);

      assetDataResults.push(assetData);
      entities.push({
        key: assetKey,
        data: assetData
      });
    });
    yield datastore.upsert(entities);
    return {
      assetDataResults
    };
  });
  return _updateAssetPrices.apply(this, arguments);
}

function getAssetPrices() {
  return _getAssetPrices.apply(this, arguments);
}

function _getAssetPrices() {
  _getAssetPrices = _asyncToGenerator(function* () {
    var [assetPrices] = yield datastore.runQuery(datastore.createQuery('AssetPrice'));
    assetPrices.sort((a, b) => b.percentChange - a.percentChange);
    return assetPrices;
  });
  return _getAssetPrices.apply(this, arguments);
}

function getHistory() {
  return _getHistory.apply(this, arguments);
}

function _getHistory() {
  _getHistory = _asyncToGenerator(function* () {
    var [historyRecords] = yield datastore.runQuery(datastore.createQuery('PrizePeriodHistory'));
    return historyRecords;
  });
  return _getHistory.apply(this, arguments);
}
//# sourceMappingURL=asset.js.map