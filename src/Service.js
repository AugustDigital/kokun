import Web3 from 'aion-web3';
import {TxnResponse} from './common/TxnResponse';

class Service {

  constructor(providerUrl) {

    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

  }

  fetchNonceNrg(address, txn) {

      return new Promise((resolve, reject) => {
        //For estimateNrg call
        let txArgs = {
          to: txn.to,
          from: address,
          value: txn.value,
          data: txn.data,
        }

        try{
            let estimatedNrg = this.web3.eth.estimateGas(txArgs);
            let nonce = this.web3.eth.getTransactionCount(address);
            resolve([nonce, estimatedNrg])
        }catch(error){
            reject(error);
        }
    })

  }

   fetchBalance(address) {

      return new Promise((resolve, reject) => {

          try{
              let that = this;
              this.web3.eth.getBalance(address, function(error, result) {
                  if(error){
                      reject(error)
                  }else{
                      let balance = result.toString();
                      resolve(balance)
                  }
              });

          }catch(error){
              reject(error)
          }
      })

  }

  async sendTransaction(encodedTx) {

      let result = await this.web3.eth.sendRawTransaction(encodedTx);

      if(result){
          let txn = TxnResponse;
          txn.txHash = result;
          return txn;
      }else{
          return false
      }
    }
}
export default Service;
