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
import KokunLogoLight from '../assets/kokun_icon_light.svg'
import KokunLogoDark from '../assets/kokun_icon_dark.svg'
import PrimaryButton from '../components/PrimaryButton'
import { developmentProvider } from '../../global_config'
import { asPromise } from '../utils/common'
import ATSInterface from '../common/ATSInterface';
import globalTokenContractRegistry from '../common/ContractRegistry'
import BigNumber from 'bignumber.js';
import ReactGA from 'react-ga';

const TRANSFER = '0xfbb001d6';

const SEND = '0xf0a147ad';
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
        completed: 0,
    }
    componentDidMount() {
        this.onChangeStep(0)
    }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
            transactionData: {}
        });
    };
    onAccountImported = (account) => {
        const { externalTransaction } = this.props;
        if (externalTransaction) {
            console.log('Got external transaction:')
            console.log(externalTransaction)
            this.onTransactionContinue(externalTransaction, account.address, account.privateKey)
        } else {
            this.setState({
                step: 1,
                account: account.address,
                privateKey: account.privateKey,
            })
            this.onChangeStep(1)
        }
    }
    async signTransaction(transaction, addr, pk) {
        const aion = new Accounts();
        const account = aion.privateKeyToAccount(pk);
        const signedTransaction = await account.signTransaction(transaction);

        return signedTransaction;
    }
    toTransaction = (currency, from, to, amount, nrg, nrgPrice, extraData) => {
        let methodData = null;
        let aionAmount = parseInt(this.state.web3.toWei(amount, "ether"), 10);
        let actualReciepient = to;
        let nonce = parseInt(this.state.web3.eth.getTransactionCount(from), 10);
        if (currency.contract) {
            const dataForToken = extraData ? extraData : '0x';
            methodData = currency.contract.send.getData(
                to,
                amount * Math.pow(10, 18),
                dataForToken)
            aionAmount = 0;
            actualReciepient = currency.contract.address
        }
        return {
            nonce: nonce,
            gasPrice: nrgPrice,
            to: actualReciepient,
            value: aionAmount,
            gas: nrg,
            timestamp: Date.now() * 1000,
            data: methodData
        };
    }
    onRequestGasEstimate = (currency, from, to, amount, nrg, nrgPrice) => {
        const transaction = this.toTransaction(currency, from, to, amount, nrg, nrgPrice);
        return this.state.web3.eth.estimateGas({ data: transaction });
    }
    decodeERC777MethodData = (data) => {
        const methodID = data ? data.substring(0, 10) : undefined;
        let tempData;
        let hexDataLength;
        switch (methodID) {
            case TRANSFER:
                return {
                    to: `0x${data.substring(10, 74)}`,
                    value: new BigNumber(`0x${data.substring(74)}`),
                    data: undefined,
                };
            case SEND:
                hexDataLength = parseInt(`0x${data.substring(138, 170).toString()}`, 16) * 2;
                tempData = `0x${data.substring(170, 170 + hexDataLength).toString()}`;
                return {
                    to: `0x${data.substring(10, 74)}`,
                    value: new BigNumber(`0x${data.substring(74, 106)}`),
                    data: tempData,
                };
            default:
                return {
                    to: undefined,
                    value: new BigNumber('0'),
                    data: undefined,
                };
        }
    }
    onTransactionContinue = async (transaction, addr, pk, transactionData) => {
        transaction.timestamp = Date.now() * 1000;
        transaction.nonce = this.state.web3.eth.getTransactionCount(addr);

        if (!transactionData) // external transaction
        {
            let contractData = null;
            const tokenContract = this.state.web3.eth.contract(ATSInterface).at(transaction.to)
            const symbol = await asPromise(tokenContract.symbol.call)
            if (0 < symbol.length) { // is token contract
                contractData = {
                    name: symbol,
                    contract: tokenContract,
                    getBalance: () => {
                        var balance = tokenContract.balanceOf.call(globalTokenContractRegistry.account).toNumber()
                        return parseFloat(this.state.web3.fromWei(balance, 'ether')).toFixed(2)
                    }
                }

                const decoded = this.decodeERC777MethodData(transaction.data);
                console.log(decoded)
                transaction = this.toTransaction(contractData, addr, decoded.to, decoded.value.toNumber() / Math.pow(10, 18), transaction.gas, transaction.gasPrice, decoded.data);
                transactionData = {
                    currency: contractData,
                    from: addr,
                    to: decoded.to,
                    amount: parseInt(decoded.value.toNumber() / Math.pow(10, 18), 10),
                    nrg: parseInt(transaction.gas, 10),
                    nrgPrice: parseInt(transaction.gasPrice, 10),
                    data: decoded.data,
                }
            } else {
                transactionData = {
                    currency: contractData,
                    from: addr,
                    to: transaction.to,
                    amount: parseInt(transaction.value, 10),
                    nrg: parseInt(transaction.gas, 10),
                    nrgPrice: parseInt(transaction.gasPrice, 10),
                    data: transaction.data
                }
            }


        }

        if (pk === 'ledger') {

            let ledgerConnection = new LedgerProvider()
            ledgerConnection.unlock(null).then((address) => {
                this.setState({ checkLedger: true });

                ledgerConnection.sign(transaction).then((signedTransaction) => {
                    this.setState({
                        checkLedger: false,
                        step: 2,
                        transactionData,
                        transaction,
                        rawTransaction: signedTransaction.rawTransaction
                    })

                }).catch((error) => {
                    console.log(error)
                    this.setState({ checkLedger: false });
                    this.onSendStepBack();
                })
            })
        } else if (pk === 'aiwa') {
            console.log(transaction)

            window.aionweb3.eth.signTransaction(transaction).then((signedTransaction) => {
                console.log(signedTransaction)
                this.setState({
                    step: 2,
                    transactionData,
                    transaction,
                    rawTransaction: signedTransaction.rawTransaction,
                    errorMessage: null
                })
                this.onChangeStep(2)
            }).catch((error) => {
                console.trace(error)
                this.setState({ errorMessage: error.toString() })
            })
        } else {
            this.signTransaction(transaction, addr, pk).then((signedTransaction) => {
                this.setState({
                    step: 2,
                    transactionData,
                    transaction,
                    rawTransaction: signedTransaction.rawTransaction
                })
                this.onChangeStep(2)
            }).catch((error) => {
                console.trace(error)
                this.setState({ errorMessage: 'Error signing transaction' })
            })
        }
    }
    onSendStepContinue = (currency, from, to, amount, nrg, nrgPrice) => {
        let transaction = this.toTransaction(currency, from, to, amount, nrg, nrgPrice)
        const transactionData = { currency, from, to, amount, nrg, nrgPrice }

        this.onTransactionContinue(transaction, this.state.account, this.state.privateKey, transactionData)
    }
    onSendStepBack = () => {
        this.setState({
            step: 0
        })
        this.onChangeStep(0)
    }
    onTransactionStepContinue = async () => {
        const {transaction, rawTransaction, transactionData} = this.state;
        const {amount, currency, from} = transactionData;
        const txHash = await this.state.web3.eth.sendRawTransaction(rawTransaction);
        const { theme} = this.props;
        let name = currency?currency.name.toUpperCase():"AION"
        ReactGA.event({
            category: 'Transaction',
            action: `Sent ${name}`,
            label:theme.palette.isWidget?'Widget':'Site',
            value: parseFloat(amount)
            });
        
        transaction.from = from;
        this.checkTransactionStatus(txHash, transaction, (status, message)=>{
            if (!this.props.skipConfirmation) {
                this.setState({
                    step: 4,
                    completed: 1,
                    transactionStatus: status,
                    transactionMessage: message,
                    transactionData: {}
                })
                this.onChangeStep(4)
            }
            
            if (window.AionPayButtonInterface.aionPayButtonCompletionListener) {
                window.AionPayButtonInterface.aionPayButtonCompletionListener(txHash, status === 1, transaction)
            }
        })
        this.setState({
            txHash,
            step: 3
        })

        this.onChangeStep(3)
        if (window.AionPayButtonInterface.aionPayButtonCompletionListener) {
            window.AionPayButtonInterface.aionPayButtonCompletionListener(txHash, null, transaction)
        }
    }
    checkTransactionStatus = (hash, transaction, callback) => {
        const timer = setInterval(() => {
            this.state.web3.eth.getTransactionReceipt(hash, (error, receipt) => {

                if (receipt) {
                    clearInterval(timer);
                    let status = parseInt(receipt.status, 16)
                    let message = status === 1 ? 'Succesfully Sent!' : 'Transaction error!';
                    callback(status, message);
                }
            })
        }, 5000);
    }
    onTransactionStepBack = () => {
        if (this.props.externalTransaction) {
            this.setState({
                step: 0
            })
        } else {
            this.setState({
                step: 1
            })
        }

        this.onChangeStep(1)
    }
    onSentSuccess = () => {
        if (this.props.onSentSuccess) {
            this.props.onSentSuccess();
        }
        this.setState({
            step: 0,
        })
        this.onChangeStep(0)
    }
    onChangeStep = async (step) => {
        this.props.onStepChanged(step, 4, this.props.skipConfirmation)
        if(step===2 && this.props.skipConfirmation){
            await this.onTransactionStepContinue();
            this.setState({
                step: 0,
                transactionData: {}
            })
            this.onChangeStep(0)
        }
    }
    createLastStep = (classes, step, completed, status, theme, currency, isTestnet, txHash) => {
        return (
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
                            <img alt="Aion Logo" className={'rotation'} src={theme.palette.isWidget ? KokunLogoDark : KokunLogoLight} width="90px" />
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
                {(step === 4) ?
                    <PrimaryButton
                        onClick={(event) => { this.onSentSuccess() }}
                        className={classes.continueButton}
                        text='Done' />
                    : null}

            </Grid>)
    }
    render() {
        const { classes, theme, showInfoHeader, web3Provider, defaultRecipient, currency, defaultAmount, defaultSender } = this.props;
        const { step, transactionData, transaction, txHash, rawTransaction, account, privateKey, checkLedger, transactionStatus, completed, errorMessage } = this.state;
        let content = null;
        let status = null;

        const isTestnet = web3Provider === developmentProvider;

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
                    onRequestGasEstimate={this.onRequestGasEstimate}
                    currency={transactionData.currency}//following data is in the case of 'back' navigation
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    rawTransaction={rawTransaction}
                    checkLedger={checkLedger}
                    defaultRecipient={defaultRecipient}
                    defaultSender={defaultSender}
                    defaultAmount={defaultAmount}
                    web3Provider={web3Provider}
                    errorMessage={errorMessage}
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
                    data={transactionData.data}
                    rawTransaction={rawTransaction}
                    privateKey={privateKey}
                    web3Provider={web3Provider}
                    transaction={transaction}
                />);
                break;
            }
            case 3:
            case 4: { //Done
                content = this.createLastStep(classes, step, completed, status, theme, currency, isTestnet, txHash);
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
