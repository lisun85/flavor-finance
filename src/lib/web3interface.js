const Web3 = require('web3');
const fs = require('fs');

var transactionCount = -1;

const _Web3 = () => {
	const infuraSubdomain = process.env.NODE_ENV === 'production'
		? 'mainnet'
		: 'rinkeby'
	const web3 = new Web3(`https://${infuraSubdomain}.infura.io/v3/${process.env.INFURA_API_KEY}`);
	const signingAccount = web3.eth.accounts.privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
	web3.eth.accounts.wallet.add(signingAccount);
	web3.eth.defaultAccount = signingAccount.address;
	return web3;
}


const getPrizeStrategyContract = web3 => {
	const PrizeStrategyContractAddress = '0xbf53e55f9901cd7109b704f2b7212095ec33d50b';
	const PrizeStrategyContractABI = JSON.parse(fs.readFileSync('./src/contracts/FlavorPrizeStrategy.json', 'utf8'));
	return new web3.eth.Contract(PrizeStrategyContractABI, PrizeStrategyContractAddress);
}


async function nextNonce() {
	if(transactionCount < 0) {
		transactionCount = await web3.eth.getTransactionCount(signingAccount.address, "pending");
	}
	return transactionCount++;
}

export {
    _Web3, getPrizeStrategyContract
};
