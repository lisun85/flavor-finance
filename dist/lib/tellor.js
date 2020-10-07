"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTellorPrices = loadTellorPrices;

var _axios = _interopRequireDefault(require("axios"));

var _psr = require("../utils/psr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function loadTellorPrices(_x, _x2) {
  return _loadTellorPrices.apply(this, arguments);
}

function _loadTellorPrices() {
  _loadTellorPrices = _asyncToGenerator(function* (priceResults, priceIds) {
    try {
      var priceAPIPromises = [];
      priceIds.forEach(id => {
        priceAPIPromises.push(new Promise((resolve, reject) => {
          _axios.default.get("http://api.tellorscan.com/price/".concat(id)).then(res => {
            resolve(res);
          });
        }));
      });
      return Promise.all(priceAPIPromises).then(values => {
        var rawPrices = [...values.map(value => value.data)];
        rawPrices.map((priceObj, index) => {
          console.log(priceObj.value, _psr.PSRs[priceIds[index]].granularity, +parseInt(priceObj.value) / +parseInt(_psr.PSRs[priceIds[index]].granularity));
          priceResults[_psr.PSRs[priceIds[index]].name] = +parseInt(priceObj.value) / +parseInt(_psr.PSRs[priceIds[index]].granularity);
        });
      });
    } catch (e) {
      console.error(e);
    }
  });
  return _loadTellorPrices.apply(this, arguments);
}
//# sourceMappingURL=tellor.js.map