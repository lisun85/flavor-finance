import axios from "axios";


async function fetchListings() {
  return new Promise((resolve, reject) => {
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        params: {
          'start': '1',
          'limit': '100',
          'convert': 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
        }
      }
    ).then((res) => {
      resolve(res.data);
    });
  });
}

async function fetchQuotes(assetSymbols) {
  return new Promise((resolve, reject) => {
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          'symbol': assetSymbols.join(',')
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
        }
      }
    ).then((res) => {
      resolve(res.data);
    });
  });

}


async function fetchAssetPrices(assetSymbols){
  return fetchQuotes(assetSymbols)
  .then(results => {
    const assetResults = {};
    Object.keys(results.data).forEach(key => {
      assetResults[key] = results.data[key].quote.USD.price;
    });
    return assetResults;
  });
}


export {
    fetchListings, fetchAssetPrices
};
