import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles} from '@material-ui/core';
import LoginStep from './LoginStep'
import RegisterStep from './RegisterStep'

import Web3 from 'aion-web3';
import {KeyterpillarContract} from '../../../global_config'
import CryptoJS from 'crypto-js'
const Accounts = require('aion-keystore')

const styles = theme => ({
    root:{

    },
    
})

class Keyterpillar extends Component {
    state={
        currentStep:0,
        web3:new Web3(new Web3.providers.HttpProvider(this.props.web3Provider)),
        txHash:null
    }

    onShowRegister(){
        this.setState({currentStep:1})
    }

    onCancelRegistration(){
        this.setState({currentStep:0})
    }

    onRegisterPKNamePass(PK, userName, pass){
        this.setState({currentStep:2})
        console.log(this.props.web3Provider)
        console.log({PK, userName, pass})
        const aion = new Accounts();
        const account = aion.privateKeyToAccount('0x'+PK);
        const from = account.address;
        console.log(from)
        const aionAmount = this.state.web3.toWei(1, "ether"); //todo agree on cost
        const actualReciepient = KeyterpillarContract.address;
        const nonce = this.state.web3.eth.getTransactionCount(from);

        const contract = this.state.web3.eth.contract(KeyterpillarContract.abi).at(KeyterpillarContract.address);

        console.log(contract.keyTypeCount.call().toNumber())
        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(PK, pass);
 
        
        const methodData = contract.addKey.getData(
            userName,
            ciphertext.toString(),
            0)//todo change to KEY TYPE
        const transaction = {
            nonce: nonce,
            gasPrice: this.state.web3.eth.gasPrice.toNumber(),
            to: actualReciepient,
            value: aionAmount,
            gas: 2000000,
            timestamp: Date.now() * 1000,
            data: methodData,
        };
        console.log(transaction)
        this.signTransaction(transaction, actualReciepient, PK)
        .then((signedTransaction)=>{
            const rawTransaction = signedTransaction.rawTransaction;
            console.log(rawTransaction)
            return this.sendTransaction(rawTransaction)
        }).then((txHash)=>{
            console.log(txHash)
            this.setState({txHash})
            this.checkTransactionStatus(txHash)
        }).catch(err=>{
            console.log(err)
        })

    }

    checkTransactionStatus = (hash) => {
        const timer = setInterval(() => {
            this.state.web3.eth.getTransactionReceipt(hash, (error, receipt) => {

                if (receipt) {
                    clearInterval(timer);
                    let status = parseInt(receipt.status, 16)
                    if(status !== 1 ){
                        console.log("TX ERROR!")
                    }
                    console.log(receipt)
                    this.setState({currentStep:0})
                    
                }
            })
        }, 2000);
    }

    onLogin(pk, pass){
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(pk, pass);
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        
        console.log(plaintext);
        this.props.onGotPkFromKeyterpillar(plaintext)
    }

    async signTransaction(transaction, addr, pk) {
        const aion = new Accounts();
        const account = aion.privateKeyToAccount(pk);
        const signedTransaction = await account.signTransaction(transaction);

        return signedTransaction;
    }

    async sendTransaction(rawTransaction) {
        const transactionHash = await this.state.web3.eth.sendRawTransaction(rawTransaction)
        return transactionHash;
    }

    render() {
        const { classes } = this.props;
        const {currentStep, web3, txHash} = this.state;
        let content;
        switch(currentStep){
            case 0 :{
                content = <LoginStep
                onShowRegister={this.onShowRegister.bind(this)}
                web3={web3}
                onLogin={this.onLogin.bind(this)}
                />
                break;
            }
            case 1 :{
                content = <RegisterStep
                onCancelRegistration={this.onCancelRegistration.bind(this)}
                onRegisterPKNamePass={this.onRegisterPKNamePass.bind(this)}
                web3={web3}/>
                break;
            }
            case 2: {
                if(txHash){
                    content = <div style={{fontSize:'12px'}}>Registration Transaction Hash:{txHash}</div>
                }else{
                    content = <div>Registering...</div>
                }
                break;
            }
            default: {
                content = <div>Error!</div>
            }
        }
        return(<div className={classes.content}>
            {content}
        </div>)
    }
}

Keyterpillar.propTypes = {
    classes: PropTypes.object.isRequired,
    onGotPkFromKeyterpillar: PropTypes.func.isRequired,
};


export default withStyles(styles)(Keyterpillar);