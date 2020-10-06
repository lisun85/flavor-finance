import axios from "axios";
import { PSRs } from "./utils/psr";
const tellor = require('./lib/tellor');
const Datastore = require('@google-cloud/datastore');


// Creates a client
const datastore = new Datastore();

const PREDICTION_ASSETS = ["2", "8", "27"]; // BTC, ETH, LINK
const ASSETS = ["BTC", "ETH", "LINK"];

async function endPrizePeriod() {
  // TODO: call completeAward method on prize strategy contract
}

async function startPrizePeriod() {

    const priceResults = {}
    await tellor.loadTellorPrices(priceResults, PREDICTION_ASSETS);
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
          value: priceResults[asset + "/USD"],
        },
        {
          name: 'latestPrice',
          value: priceResults[asset + "/USD"],
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
    const priceResults = {}
    await tellor.loadTellorPrices(priceResults, PREDICTION_ASSETS);


    const entities = [];
    const assetDataResults = [];
    assetEntities[0].forEach((assetEntity, index) => {
      const latestPrice = priceResults[assetEntity.asset + "/USD"];
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
  return assetPrices;
}


 export {
     startPrizePeriod, endPrizePeriod, updateAssetPrices, getAssetPrices
 };
