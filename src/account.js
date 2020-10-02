const Datastore = require('@google-cloud/datastore');
const web3interface = require('./web3interface');
const web3 = web3interface.web3;
const ProxyWalletABI = web3interface.ProxyWalletABI;
const signingAccount = web3interface.signingAccount;
const FactoryContract = web3interface.FactoryContract;
const FactoryAddress = web3interface.FactoryAddress;

// Creates a client
const datastore = new Datastore();


async function getAccount(address) {
  const accountKey = datastore.key(['Account', address]);
  return new Promise((resolve, reject) => {
    datastore.get(accountKey).then((results, err) => {
      results
       ? resolve(results[0])
       : reject(err);
    });
  });
}

async function updateAccount(address, selectedAsset){
  const accountKey = datastore.key(['Account', address]);
  const entity = {
    key: accountKey,
    data: [
      {
        name: 'address',
        value: address,
      },
      {
        name: 'selectedAsset',
        value: selectedAsset,
      },
    ],
  };
  await datastore.save(entity);
  return {
    address,
    selectedAsset
  }
}





export {
    getAccount, updateAccount
};
