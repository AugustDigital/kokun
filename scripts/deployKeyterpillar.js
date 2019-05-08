const Accounts = require('aion-keystore');
const Web3 = require('aion-web3');
let fs = require("fs");

// Initialize web3
const provider = new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8");
const web3 = new Web3(provider);

const deployContract = async () => {
  // Import Solidiy Contract
  const solContract = fs.readFileSync('../contracts/Keyterpillar.sol', {
    encoding: 'utf8'
  });

  // Initilize Account
  const aionKeystore = new Accounts();
  const account = aionKeystore.privateKeyToAccount(
    '094577139ac3c71c6b1a18e9929342d53451b55b0655ffc9111c658c377ee78fe0c08f8d0b9f479951165522b7349e4e317b7a17ca2bbb670af320bf9619fb54' // Add Private Key of Account that will be used to deploy contract
  );

  // Compile Contract
  const compiledContract = web3.eth.compile.solidity(solContract);

  const contractAbi = compiledContract.Keyterpillar.info.abiDefinition;
  console.log(JSON.stringify(contractAbi))
  const contractCode = compiledContract.Keyterpillar.code;


  // Declare Contract
  const contract = web3.eth.contract(contractAbi);

  // Get Contract Data
  const contractData = contract.new.getData(
    //false,
    //Math.floor(Date.now() / 1000)+60*60*24*5,
    {
      data: contractCode
    }
  );

  // Get Transaction
  const transaction = await getTransactionObject(contractData, account.address);

  // Sign Transaction
  const signedTransaction = await account.signTransaction(transaction);

  // Send Raw Transaction
  const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);

  console.log('Transaction Hash: ', transactionHash);

  // Poll Transaction and get Transaction Receipt
  const transactionReceipt = getTransactionReceipt(transactionHash);

  // Write to console
  console.log('Contract Address: ', transactionReceipt.contractAddress);
};

const getTransactionReceipt = transactionHash => {
  let transactionReceipt = null;

  process.stdout.write('Transaction Pending');

  do {
    transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
    process.stdout.write('...');
  } while (transactionReceipt == null);

  console.log('Transaction Complete!');

  return transactionReceipt;
};

const getTransactionObject = async (contractData, address) => {
  // Get Gas Estimates and Nonce
  const nonce = web3.eth.getTransactionCount(address);
  const gasPrice = web3.eth.gasPrice;
  // const gas = await web3.eth.estimateGas({ data: contractData });

  // Declare Transaction Obj
  const transaction = {
    nonce,
    gasPrice,
    gas: 5000000,
    data: contractData,
    timestamp: Date.now() * 1000,
    value:1*Math.pow(10,18)
  };

  return transaction;
};

deployContract().catch(error => {
  console.log(error.message);
});