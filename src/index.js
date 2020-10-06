require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const account = require('./account');
const asset = require('./asset');
const path = require("path");
const app = express();

app.use( bodyParser.json() );  // to support JSON-encoded bodies

app.use('/static', express.static(path.join(__dirname, "../client/build/static")));

app.get('/api/account', (req, res, next) => {
  const address = req.query.address;
  account.getAccount(address)
    .then((account) => {
      res.json({ account });
    })
    .catch(next);

});

app.post('/api/account', (req, res, next) => {
  let address = req.body.address;
  let selectedAsset = req.body.selectedAsset;
  account.updateAccount(address, selectedAsset)
    .then((account) => {
      res.json({ account });
    })
    .catch(next);
});

app.get('/api/test', (req, res, next) => {
    res.json({ 'message': 'hello world' });
});

app.get('/api/cyclePrizePeriod', (req, res, next) => {
    asset.endPrizePeriod();
    asset.startPrizePeriod().then(results => {
      res.json({ results });
    })
    .catch(next);
});

app.get('/api/updateAssetPrices', (req, res, next) => {
    asset.updateAssetPrices().then(results => {
      res.json({ results });
    })
    .catch(next);
});

app.get('/api/assetPrices', (req, res, next) => {
    asset.getAssetPrices().then(results => {
      res.json({ results });
    })
    .catch(next);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
