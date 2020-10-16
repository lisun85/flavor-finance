"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchListings = fetchListings;
exports.fetchAssetPrices = fetchAssetPrices;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function fetchListings() {
  return _fetchListings.apply(this, arguments);
}

function _fetchListings() {
  _fetchListings = _asyncToGenerator(function* () {
    return new Promise((resolve, reject) => {
      _axios.default.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        params: {
          'start': '1',
          'limit': '100',
          'convert': 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
        }
      }).then(res => {
        resolve(res.data);
      });
    });
  });
  return _fetchListings.apply(this, arguments);
}

function fetchQuotes(_x) {
  return _fetchQuotes.apply(this, arguments);
}

function _fetchQuotes() {
  _fetchQuotes = _asyncToGenerator(function* (assetSymbols) {
    return new Promise((resolve, reject) => {
      _axios.default.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
        params: {
          'symbol': assetSymbols.join(',')
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
        }
      }).then(res => {
        resolve(res.data);
      });
    });
  });
  return _fetchQuotes.apply(this, arguments);
}

function fetchAssetPrices(_x2) {
  return _fetchAssetPrices.apply(this, arguments);
}

function _fetchAssetPrices() {
  _fetchAssetPrices = _asyncToGenerator(function* (assetSymbols) {
    return fetchQuotes(assetSymbols).then(results => {
      var assetResults = {};
      Object.keys(results.data).forEach(key => {
        assetResults[key] = results.data[key].quote.USD.price;
      });
      return assetResults;
    });
  });
  return _fetchAssetPrices.apply(this, arguments);
}
//# sourceMappingURL=coinmarketcap.js.map