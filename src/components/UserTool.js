import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Grid } from '@material-ui/core'
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
import web3Provider from '../utils/getWeb3';

const Accounts = require('aion-keystore')

const styles = theme => ({
    continueButton: {
        float: 'right',
        marginTop: theme.spacing.unit * 4,
        backgroundColor: 'rgb(31,133,163)'
    }
})
class UserTool extends Component {

    state = {
        step: 0,//todo switch back to 0 after testing
        transactionData: {

        },
        account: null,
        privateKey: null,
        web3: null
    }

    componentDidMount() {
        web3Provider.then((results) => {
            this.setState({web3: results.web3});
        }).catch((err)=>{
            console.log(err)
        })
    }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
            transactionData: null
        });
    };
    onAccountImported = (account) => {
        this.setState({
            account: account.address,
            privateKey: account.privateKey,
            step: 1
        })
    }
    async signTransaction(nrgPrice, to, amount, nrg) {
        const aion = new Accounts();
        const account = aion.privateKeyToAccount(this.state.privateKey);
        const nonce = this.state.web3.eth.getTransactionCount(account.address);
        let totalAions = this.state.web3.toWei(amount, "ether");

        let transaction = {
            nonce: nonce,
            gasPrice:nrgPrice,
            to: to,
            value: totalAions,
            gas: nrg,
            timestamp: Date.now() * 1000
        };

        const signedTransaction = await account.signTransaction(transaction);

        return signedTransaction;
    }

    onSendStepContinue = (currency, from, to, amount, nrg, nrgPrice, nrgMax) => {
        this.signTransaction(nrgPrice, to, amount, nrg).then((signedTransaction)=>{
            this.setState({
                step: 2,
                transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgMax  },
                signedTransaction: signedTransaction.rawTransaction
            })
        })
        //todo pass transaction data to next step
    }
    onSendStepBack = () => {
        this.setState({
            step: 0
        })
    }

    onTransactionStepContinue = (txHash) => {
        console.log('...done')
        this.setState({
            step: 3,
            txHash
        })
    }
    onTransactionStepBack = () => {
        this.setState({
            step: 1
        })
    }
    onSentSuccess = () => {
        this.setState({
            step: 0
        })
    }
    render() {
        const { classes } = this.props;
        const { step, transactionData, txHash, signedTransaction } = this.state;
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
                    account={this.state.account}
                    onSendStepContinue={this.onSendStepContinue}
                    onSendStepBack={this.onSendStepBack}
                    currency={transactionData.currency}//following data is in the case of 'back' navigation
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    nrgMax={transactionData.nrgMax}
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
                    nrgMax={transactionData.nrgMax}
                    signedTransaction={signedTransaction}
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
                        Sent!
                        Transaction Hash:{txHash}
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
};

export default withStyles(styles)(UserTool);
