"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startPrizePeriod = startPrizePeriod;
exports.endPrizePeriod = endPrizePeriod;
exports.updateAssetPrices = updateAssetPrices;
exports.getAssetPrices = getAssetPrices;

var _axios = _interopRequireDefault(require("axios"));

var _psr = require("./utils/psr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var tellor = require('./lib/tellor');

var Datastore = require('@google-cloud/datastore'); // Creates a client


var datastore = new Datastore();
var PREDICTION_ASSETS = ["2", "1", "27"]; // BTC, ETH, LINK

var ASSETS = ["BTC", "ETH", "LINK"];

function endPrizePeriod() {
  return _endPrizePeriod.apply(this, arguments);
}

function _endPrizePeriod() {
  _endPrizePeriod = _asyncToGenerator(function* () {// TODO: call completeAward method on prize strategy contract
  });
  return _endPrizePeriod.apply(this, arguments);
}

function startPrizePeriod() {
  return _startPrizePeriod.apply(this, arguments);
}

function _startPrizePeriod() {
  _startPrizePeriod = _asyncToGenerator(function* () {
    var priceResults = {};
    yield tellor.loadTellorPrices(priceResults, PREDICTION_ASSETS);
    var entities = [];
    var assetDataResults = [];
    ASSETS.forEach((asset, index) => {
      var assetKey = datastore.key(['AssetPrice', asset]);
      var assetData = [{
        name: 'asset',
        value: asset
      }, {
        name: 'prizePeriodStartPrice',
        value: priceResults[asset + "/USD"]
      }, {
        name: 'latestPrice',
        value: priceResults[asset + "/USD"]
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
    var priceResults = {};
    yield tellor.loadTellorPrices(priceResults, PREDICTION_ASSETS);
    var entities = [];
    var assetDataResults = [];
    assetEntities[0].forEach((assetEntity, index) => {
      var latestPrice = priceResults[assetEntity.asset + "/USD"];
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
    return assetPrices;
  });
  return _getAssetPrices.apply(this, arguments);
}
//# sourceMappingURL=asset.js.map