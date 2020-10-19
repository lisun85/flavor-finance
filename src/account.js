const Datastore = require('@google-cloud/datastore');


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
