const Web3 = require('web3');
const fs = require('fs');

var transactionCount = -1;

const getPodContract = function() {
	const signingAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.ETH_PRIVATE_KEY);
	const infuraSubdomain = process.env.NODE_ENV === 'production'
		? 'mainnet'
		: 'ropsten'
	const web3 = new Web3(`https://${infuraSubdomain}.infura.io/v3/${process.env.INFURA_KEY}`);
	const PodContractAddress = '0x...';
	const PodContract = JSON.parse(fs.readFileSync('./contracts/FlavorPod.json', 'utf8'));
	const PodContractABI = PodContract['abi'];
	return new web3.eth.Contract(PodContractABI, PodContractAddress,
	{
		from: signingAccount.address,
		gas: '1500000',
		gasPrice: 20000000000,
	});
}


async function nextNonce() {
	if(transactionCount < 0) {
		transactionCount = await web3.eth.getTransactionCount(signingAccount.address, "pending");
	}
	return transactionCount++;
}

export {
    getPodContract
};
