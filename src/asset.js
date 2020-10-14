import axios from "axios";
const coinmarketcap = require('./lib/coinmarketcap');
const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore();

const ASSETS = ["BTC", "ETH", "LINK"];

async function endPrizePeriod() {
  // TODO: call completeAward method on prize strategy contract
  //await completeAward();
  const winner = await calculateWinner();
  saveWinner(winner);

  // TODO: replace this with event so it will always be onchain result
}

async function completeAward() {
  const podContract = web3interface.getPodContract();
  podContract.methods.completeAward()
  .send({ from: process.env.ETH_SIGNING_ACCOUNT, gas: '1500000' }, async (error, txHash) => {
    if (error) {
        //onTxHash && onTxHash('')
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
  const winner = assetPrices[0];
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
  return assetPrices;
}



async function getHistory() {
  const [historyRecords] = await datastore.runQuery(
    datastore.createQuery('PrizePeriodHistory')
  );
  return historyRecords;
}


 export {
     startPrizePeriod, endPrizePeriod, updateAssetPrices, getAssetPrices, calculateWinner, getHistory
 };
