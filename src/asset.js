import axios from "axios";
const coinmarketcap = require('./lib/coinmarketcap');
const web3interface = require('./lib/web3interface');
const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore();

const ASSETS = ["BTC", "ETH", "SDEFI"];

async function endPrizePeriod() {
  // TODO: call completeAward method on prize strategy contract

  // TODO: replace this with event so it will always be onchain result
  const winner = await calculateWinner();
  saveWinner(winner);
  await completeAward();

}

async function completeAward() {
  const web3 = web3interface._Web3();
  const prizeStrategyContract = web3interface.getPrizeStrategyContract(web3);
  prizeStrategyContract.methods.completeAward()
  .send({
    from: web3.eth.defaultAccount,
    gas: '1500000',
		gasPrice: 20000000000
  }, async (error, txHash) => {
    if (error) {
        console.log("Depositing error", error)
        return false
    }
  });

}
async function calculateWinner() {
  const [assetPrices] = await datastore.runQuery(
    datastore.createQuery('AssetPrice')
  );

  assetPrices.sort((a, b) => b.percentChange - a.percentChange);
  const winner = assetPrices.filter(asset => ASSETS.includes(asset.asset))[0];
  console.log('winner', winner);
  return winner;
}

async function saveWinner(winner){
  const today = new Date().toISOString().slice(0, 10);
  const winnerKey = datastore.key(['PrizePeriodHistory', today]);
  const entity = {
    key: winnerKey,
    data: [
      {
        name: 'date',
        value: today,
      },
      {
        name: 'asset',
        value: winner.asset,
      },
      {
        name: 'prizePeriodStartPrice',
        value: winner.prizePeriodStartPrice,
      },
      {
        name: 'latestPrice',
        value: winner.latestPrice,
      },
      {
        name: 'percentChange',
        value: winner.percentChange,
      },
    ],
  };
  await datastore.save(entity);
  return {
    winner
  }
}


async function startPrizePeriod() {

    const assetPrices = await coinmarketcap.fetchAssetPrices(ASSETS);
    const entities = [];
    const assetDataResults = [];
    ASSETS.forEach((asset, index) => {

      const assetKey = datastore.key(['AssetPrice', asset]);
      const assetData = [
        {
          name: 'asset',
          value: asset,
        },
        {
          name: 'prizePeriodStartPrice',
          value: assetPrices[asset],
        },
        {
          name: 'latestPrice',
          value: assetPrices[asset],
        },
        {
          name: 'percentChange',
          value: 0,
        },
      ];
      assetDataResults.push(assetData);
      entities.push({
        key: assetKey,
        data: assetData,
      });

    });

    await datastore.upsert(entities);

    return {
      assetDataResults
    }

}

async function _getAssetEntities() {
  const assetKeys = ASSETS.map(asset => datastore.key(['AssetPrice', asset]));
  return new Promise((resolve, reject) => {
    datastore.get(assetKeys).then((results, err) => {
      results
       ? resolve(results)
       : reject(err);
    });
  });
}

function _percentChange(startPrice, latestPrice) {
  const priceDiff = latestPrice - startPrice;
  return priceDiff/startPrice * 100;
}

async function updateAssetPrices() {

    const assetEntities = await _getAssetEntities();
    const assetPrices = await coinmarketcap.fetchAssetPrices(ASSETS);
    const entities = [];
    const assetDataResults = [];
    assetEntities[0].forEach((assetEntity, index) => {
      const latestPrice = assetPrices[assetEntity.asset];
      console.log(`latest price for ${assetEntity.asset} is ${latestPrice}`);
      const assetKey = datastore.key(['AssetPrice', assetEntity.asset]);
      const assetData = [
        {
          name: 'asset',
          value: assetEntity.asset,
        },
        {
          name: 'prizePeriodStartPrice',
          value: assetEntity.prizePeriodStartPrice,
        },
        {
          name: 'latestPrice',
          value: latestPrice,
        },
        {
          name: 'percentChange',
          value: _percentChange(assetEntity.prizePeriodStartPrice, latestPrice),
        },
      ];
      //console.log(assetEntity, assetData);
      assetDataResults.push(assetData);
      entities.push({
        key: assetKey,
        data: assetData,
      });

    });

    await datastore.upsert(entities);

    return {
      assetDataResults
    }

}

async function getAssetPrices() {
  const [assetPrices] = await datastore.runQuery(
    datastore.createQuery('AssetPrice')
  );

  assetPrices.sort((a, b) => b.percentChange - a.percentChange);
  return assetPrices.filter(asset => ASSETS.includes(asset.asset));
}



async function getHistory() {
  const [historyRecords] = await datastore.runQuery(
    datastore.createQuery('PrizePeriodHistory').order('date', {
        descending: true,
    })
  );
  return historyRecords;
}


 export {
     startPrizePeriod, endPrizePeriod, updateAssetPrices, getAssetPrices, calculateWinner, getHistory
 };
