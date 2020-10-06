require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const account = require('./account');
const path = require("path");
const axios = require('axios')
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// uses Tellor HTTP API to get latest prices
app.get("/assetPrices", (req, res) => {
  let priceArray = []
  // GET ETH/USD price
  axios.get('http://api.tellorscan.com/price/1')
  .then(getResponse => {
    priceArray.push(getResponse.data.value)
  })

  .then(() => {
    // GET BTC/USD price
    axios.get('http://api.tellorscan.com/price/2')
    .then(getResponse2 => {
      priceArray.push(getResponse2.data.value)
    })
    
    .then(() => {
      // GET AMPL/USD price
      axios.get('http://api.tellorscan.com/price/10')
      .then(getResponse3 => {
        priceArray.push(getResponse3.data.value)
      })

      .then(() => {
        res.json({'prices': priceArray})
      })
    })
  })
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
