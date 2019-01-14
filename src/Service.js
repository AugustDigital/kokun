import React, { Component } from 'react';
import web3Provider from './utils/getWeb3';
import {TxnResponse} from './common/TxnResponse';

class Service extends Component{

  constructor(props) {
      super(props);
      this.state = {web3: null}
  }

  fetchNrg(txn) {

      return new Promise((resolve, reject) => {

        let txArgs = {
          to: txn.to,
          from: txn.address,
          value: txn.value
        }

        try{
            web3Provider.then((result) => {
                let estimatedNrg = result.web3.eth.estimateGas(txArgs);
                resolve(estimatedNrg)
            }).catch((e) =>{
                reject(e)
            });
        }catch(error){
            reject(error);
        }
    })

  }

   fetchBalance(address) {

      return new Promise((resolve, reject) => {

          try{
              web3Provider.then((result) => {
                  result.eth.getBalance(address, function(error, result) {
                      if(error){
                          reject(error)
                      }else{
                          let balance = result.toString();
                          resolve(balance)
                      }
                  });
              });

          }catch(error){
              reject(error)
          }
      })

  }

  async sendTransaction(encodedTx) {

      web3Provider.then((result) => {

          let hash = result.web3.eth.sendRawTransaction(encodedTx);

          if(hash){
              let txn = TxnResponse;
              txn.txHash = hash;
              return txn;
          }else{
              return false
          }
      })
    }
}
export default Service;
