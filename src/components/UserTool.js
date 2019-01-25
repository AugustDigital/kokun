import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'aion-web3';
import { withStyles, Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
import { CheckCircleRounded, HighlightOffRounded } from '@material-ui/icons'
import LedgerProvider from '../utils/ledger/LedgerProvider';
import AionLogoLight from '../assets/aion_logo_light.svg'
import AionLogoDark from '../assets/aion_logo_dark.svg'
import PrimaryButton from '../components/PrimaryButton'
import { developmentProvider } from '../../global_config'
const Accounts = require('aion-keystore')

const styles = theme => ({
    continueButton: {
        float: 'right',
        marginTop: theme.spacing.unit * 4,
    },
    checkIcon: {
        fontSize: 84,
        color: theme.palette.common.green
    },
    errorIcon: {
        fontSize: 84,
        color: theme.palette.common.red
    },
    link: {
        color: '#00CEFF',
        fontWeight: 'light',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
    },
    linkText: {
        marginTop: '20px'
    }

})
class UserTool extends Component {

    state = {
        step: 0,
        transactionData: {

        },
        account: null,
        privateKey: null,
        web3: new Web3(new Web3.providers.HttpProvider(this.props.web3Provider)),
        rawTransaction: null,
        checkLedger: false,
        transactionMessage: null,
        transactionStatus: 2,
        completed: 0
    }
    componentDidMount() {
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
        if (this.state.privateKey === 'ledger') {
            const nonce = this.state.web3.eth.getTransactionCount(from);
            let totalAions = this.state.web3.toWei(amount, "ether");

            let transaction = {
                nonce: nonce,
                from: from,
                to: to,
                value: parseInt(totalAions, 10),
                gasPrice: nrgPrice,
                gas: nrg,
                timestamp: Date.now() * 1000,
                data: '0x'
            };

            let ledgerConnection = new LedgerProvider()
            ledgerConnection.unlock(null).then((address) => {
                this.setState({ checkLedger: true });
                ledgerConnection.sign(transaction).then((signedTransaction) => {
                    this.setState({
                        checkLedger: false,
                        step: 2,
                        transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit },
                        rawTransaction: signedTransaction.rawTransaction
                    })

                }).catch((error) => {
                    this.setState({ checkLedger: false });
                    this.onSendStepBack();
                })
            })
        } else {
            this.signTransaction(nrgPrice, to, amount, nrg).then((signedTransaction) => {
                this.setState({
                    step: 2,
                    transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit },
                    rawTransaction: signedTransaction.rawTransaction
                })
                this.onChangeStep(2)
            }).catch((error) => {
                alert(error)
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

                if (receipt) {
                    clearInterval(timer);
                    let status = parseInt(receipt.status,16)
                    let message = status === 1 ? 'Succesfully Sent!' : 'Transaction error!';
                    this.setState({
                        step: 4,
                        completed: 1,
                        transactionStatus: status,
                        transactionMessage: message,
                        transactionData: {}
                    })
                    this.onChangeStep(4)
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
        const { classes, theme, showInfoHeader, web3Provider, defaultRecipient, currency } = this.props;
        const { step, transactionData, txHash, rawTransaction, account, privateKey, checkLedger, transactionStatus, completed } = this.state;
        let content = null;
        let status = null;

        const isTestnet =  web3Provider === developmentProvider;

        if (transactionStatus === 1) {
            status = <CheckCircleRounded className={classes.checkIcon} />
        } else if (transactionStatus === 0) {
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
            case 3:
            case 4: { //Done
                content = (
                    <Grid spacing={0}
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        wrap='nowrap'>
                        {
                            (completed === 1) ?
                                status :
                                <Grid spacing={0}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center">
                                    <img alt="Aion Logo" className={'rotation'} src={theme.palette.isWidget ? AionLogoDark : AionLogoLight} width="90px" />
                                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '30px' }}>Sending {currency}</Typography>
                                    <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '20px' }}> Sending transaction and waiting for at least one block confirmation.</Typography>
                                    <Typography variant="subtitle2" style={{ fontWeight: 'light' }}> Please be patient this wont't take too long...</Typography>
                                </Grid>
                        }

                        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '30px' }}>{this.state.transactionMessage}</Typography>

                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            className={classes.linkText}
                            wrap='nowrap'>
                            <Typography variant="subtitle2">{'Transaction\u00A0Hash:\u00A0'}</Typography>
                            <a target='_blank' rel='noopener noreferrer' className={classes.link} href={`https://${isTestnet ? 'mastery' : 'mainnet'}.aion.network/#/transaction/${txHash}`}>{txHash}</a>

                        </Grid>

                        <PrimaryButton
                            onClick={(event) => { this.onSentSuccess() }}
                            className={classes.continueButton}
                            text='Done' />
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

export default compose(
    withStyles(styles, { name: 'UserTool' }),
    withTheme()
)(UserTool);
