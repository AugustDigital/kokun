import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Grid, Typography } from '@material-ui/core'
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
import { CheckCircleRounded, HighlightOffRounded } from '@material-ui/icons'
import getWeb3 from '../utils/getWeb3';
import LedgerProvider from '../utils/ledger/LedgerProvider';
import AionLogoLight from '../assets/aion_logo_light.svg'
const Accounts = require('aion-keystore')

const styles = theme => ({
    continueButton: {
        float: 'right',
        marginTop: theme.spacing.unit * 4,
        backgroundColor: theme.palette.common.primaryButton,
    },
    checkIcon: {
        fontSize: 84,
        color: theme.palette.common.green
    },
    errorIcon: {
        fontSize: 84,
        color: theme.palette.common.red
    }

})
class UserTool extends Component {

    state = {
        step: 0,
        transactionData: {

        },
        account: null,
        privateKey: null,
        web3: null,
        rawTransaction: null,
        checkLedger: false,
        transactionMessage: null,
        transactionStatus: 2,
        completed:0
    }

    componentDidMount() {
        this.setState({ web3: getWeb3(this.props.web3Provider)});
        this.onChangeStep(0)
    }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
            transactionData: null
        });
    };
    onAccountImported = (account) => {
        this.setState({
            step: 1,
            account: account.address,
            privateKey: account.privateKey,
        })
        this.onChangeStep(1)
    }
    async signTransaction(nrgPrice, to, amount, nrg) {
        const aion = new Accounts();
        const account = aion.privateKeyToAccount(this.state.privateKey);
        const nonce = this.state.web3.eth.getTransactionCount(account.address);
        let totalAions = this.state.web3.toWei(amount, "ether");

        let transaction = {
            nonce: nonce,
            gasPrice: nrgPrice,
            to: to,
            value: totalAions,
            gas: nrg,
            timestamp: Date.now() * 1000
        };

        const signedTransaction = await account.signTransaction(transaction);

        return signedTransaction;
    }
    onSendStepContinue = (currency, from, to, amount, nrg, nrgPrice, nrgLimit) => {
        if(this.state.privateKey === 'ledger'){
            const nonce = this.state.web3.eth.getTransactionCount(from);
            let totalAions = this.state.web3.toWei(amount, "ether");

            let transaction = {
                nonce: nonce,
                from: from,
                to: to,
                value: parseInt(totalAions,10),
                gasPrice:nrgPrice,
                gas: nrg,
                timestamp: Date.now() * 1000,
                data:'0x'
            };

            let ledgerConnection = new LedgerProvider()
            ledgerConnection.unlock(null).then((address) => {
                this.setState({checkLedger:true});
                ledgerConnection.sign(transaction).then((signedTransaction) => {
                    this.setState({
                        checkLedger:false,
                        step: 2,
                        transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit },
                        rawTransaction: signedTransaction.rawTransaction
                    })

                }).catch((error) => {
                    this.setState({checkLedger:false});
                    this.onSendStepBack();
                })
            })
        }else{
            this.signTransaction(nrgPrice, to, amount, nrg).then((signedTransaction)=>{
                this.setState({
                    step: 2,
                    transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit },
                    rawTransaction: signedTransaction.rawTransaction
                })
            })
        }

    }
    onSendStepBack = () => {
        this.setState({
            step: 0
        })
        this.onChangeStep(0)
    }

    onTransactionStepContinue = (txHash) => {
        this.checkTransactionStatus(txHash)
        this.setState({
            txHash,
            step: 3
        })
        this.onChangeStep(3)
    }
    checkTransactionStatus = (hash) => {
        const timer = setInterval(() => {
            this.state.web3.eth.getTransactionReceipt(hash, (error, receipt) => {

                if(receipt){
                    clearInterval(timer);
                    let message = receipt.status == 1 ? 'Succesfully Sent!' : 'Transaction error!';
                    this.setState({
                        completed:1,
                        transactionStatus: receipt.status,
                        transactionMessage: message
                    })
                }
            })
        }, 5000);
    }
    onTransactionStepBack = () => {
        this.setState({
            step: 1
        })
        this.onChangeStep(1)
    }
    onSentSuccess = () => {
        this.setState({
            step: 0
        })
        this.onChangeStep(0)
    }
    onChangeStep = (step) => {
        this.props.onStepChanged(step, 4)
    }
    render() {
        const { classes, showInfoHeader, web3Provider, defaultRecipient, currency } = this.props;
        const { step, transactionData, txHash, rawTransaction, account, privateKey, checkLedger, transactionStatus, completed } = this.state;
        let content = null;
        let status = null;

        if(transactionStatus == 1){
            status = <CheckCircleRounded className={classes.checkIcon} />
        }else if(transactionStatus == 0){
            status = <HighlightOffRounded className={classes.errorIcon} />
        }

        switch (step) {
            case 0: { // Account import
                content = (<WalletProvidersStep
                    onAccountImported={this.onAccountImported}
                    showInfoHeader={showInfoHeader}
                />);
                break;
            }
            case 1: { // Send
                content = (<SendStep
                    account={account}
                    onSendStepContinue={this.onSendStepContinue}
                    onSendStepBack={this.onSendStepBack}
                    currency={transactionData.currency}//following data is in the case of 'back' navigation
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    nrgLimit={transactionData.nrgLimit}
                    rawTransaction={rawTransaction}
                    checkLedger={checkLedger}
                    defaultRecipient={defaultRecipient}
                />);
                break;
            }
            case 2: { // Confirm
                content = (<ConfirmStep
                    onTransactionStepContinue={this.onTransactionStepContinue}
                    onTransactonStepBack={this.onTransactionStepBack}
                    currency={transactionData.currency}
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    nrgLimit={transactionData.nrgLimit}
                    rawTransaction={rawTransaction}
                    privateKey={privateKey}
                    web3Provider={web3Provider}
                />);
                break;
            }
            case 3: { //Done
                content = (
                    <Grid spacing={0}
                        container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        {
                            (completed == 1) ?
                            status :
                            <Grid spacing={0}
                                container
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <img alt="Aion Logo" className={'rotation'} src={AionLogoLight} width="90px" />
                                <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '30px' }}>Sending {currency}</Typography>
                                <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '20px' }}> Sending transaction and waiting for at least one block confirmation.</Typography>
                                <Typography variant="subtitle2" style={{ fontWeight: 'light' }}> Please be patient this wont't take too long...</Typography>
                            </Grid>
                        }
                        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '30px' }}>{this.state.transactionMessage}</Typography>
                        <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '20px' }}> Transaction Hash: <a target='_blank' rel='noopener noreferrer' href={'https://mastery.aion.network/#/transaction/' + txHash}>{txHash}</a></Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(event) => { this.onSentSuccess() }}
                            className={classes.continueButton}>
                            <b>Done</b>
                        </Button>
                    </Grid>)
                break;
            }
            default: {
                content = (null);
            }
        }

        return (
            content
        );
    }
}

UserTool.propTypes = {
    classes: PropTypes.object.isRequired,
    onStepChanged: PropTypes.func.isRequired,
    web3Provider: PropTypes.string.isRequired,
};

export default withStyles(styles)(UserTool);
