import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Grid, Typography } from '@material-ui/core'
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
import { CheckCircleRounded } from '@material-ui/icons'
import web3Provider from '../utils/getWeb3';
import LedgerProvider from '../utils/ledger/LedgerProvider';
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
        rawTransaction: null
    }

    componentDidMount() {
        web3Provider.then((results) => {
            this.setState({ web3: results.web3 });
        }).catch((err) => {
            console.log(err)
        })
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
        if(this.state.privateKey == 'ledger'){
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
            console.log("===")
            console.log(transaction)
            console.log("===")
            let ledgerConnection = new LedgerProvider()
            ledgerConnection.unlock(null).then((address) => {

                ledgerConnection.sign(transaction).then((signedTransaction) => {
                    this.setState({
                        step: 2,
                        transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit },
                        rawTransaction: signedTransaction.rawTransaction
                    })

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

        this.setState({
            txHash,
            step: 3
        })
        this.onChangeStep(3)
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
        const { classes } = this.props;
        const { step, transactionData, txHash, rawTransaction, account, privateKey } = this.state;
        let content = null;

        switch (step) {
            case 0: { // Account import
                content = (<WalletProvidersStep
                    onAccountImported={this.onAccountImported}
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
                        <CheckCircleRounded className={classes.checkIcon} />
                        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '30px' }}>Succesfully Sent!</Typography>
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
};

export default withStyles(styles)(UserTool);
