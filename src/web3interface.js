const Web3 = require('web3');

const web3 = new Web3('https://ropsten.infura.io/v3/' + process.env.INFURA_KEY);
const signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f');//process.env.ETH_PRIVATE_KEY);

const fs = require('fs');

const ExampleContractAddress = '0x...';
const ExampleContract = null;//JSON.parse(fs.readFileSync('./contracts/ExampleContract.json', 'utf8'));
const ExampleContractABI = null;//ExampleContract['abi'];

var transactionCount = -1;

const getExampleContract = function(contractAddress) {
	return new web3.eth.Contract(ExampleContractABI, contractAddress,
	{
		from: signingAccount.address,
		gas: '1500000',
		gasPrice: 20000000000,
	});
}

const ExampleContractInstance = null;
// const ExampleContractInstance = new web3.eth.Contract(ExampleContractABI, ExampleContractAddress,
// 	{
// 		from: signingAccount.address,
// 		gas: '1500000',
// 		gasPrice: 20000000000,
// 	});

async function nextNonce() {
	if(transactionCount < 0) {
		transactionCount = await web3.eth.getTransactionCount(signingAccount.address, "pending");
	}
	return transactionCount++;
}

export {
    web3, signingAccount, getExampleContract, ExampleContractAddress, ExampleContractInstance, nextNonce
};
