"use strict";

require('dotenv').config();

var express = require('express');

var bodyParser = require('body-parser');

var account = require('./account');

var path = require("path");

var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use('/static', express.static(path.join(__dirname, "../client/build/static")));
app.get('/api/account', (req, res, next) => {
  var address = req.query.address;
  account.getAccount(address).then(account => {
    console.log('account', account);
    res.json({
      account
    });
  }).catch(next);
});
app.post('/api/account', (req, res, next) => {
  var address = req.body.address;
  var selectedAsset = req.body.selectedAsset;
  account.updateAccount(address, selectedAsset).then(account => {
    res.json({
      account
    });
  }).catch(next);
});
app.get('/api/test', (req, res, next) => {
  res.json({
    'message': 'hello world'
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Node server listening on port ".concat(port));
});
//# sourceMappingURL=index.js.map