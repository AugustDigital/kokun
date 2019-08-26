import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'aion-web3';
import { withStyles, Typography, TextField, Grid, Button } from '@material-ui/core'
import { Warning } from '@material-ui/icons';
import PrimaryButton from '../PrimaryButton'
import * as TransactionUtil from '../../utils/TransactionUtil';
import SecondaryButton from '../SecondaryButton';
import CoinDropdown from '../CoinDropdown';
import ATSInterface from '../../common/ATSInterface';
import globalTokenContractRegistry from '../../common/ContractRegistry'
import AddTokenDialog from '../AddTokenDialog'
import queryString from 'stringquery'
import {isJavaToken, isSolToken} from '../../utils/common.js'


const styles = theme => ({
    dropDownContainer: {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '3px',
        borderColor: theme.palette.secondary.main,
        width: 'auto'
    },
    dropDownLable: {
        borderRight: '1px solid ' + theme.palette.secondary.main,
        fontWeight: 'light',
        float: 'left',
        position: 'reltive',
        paddingTop: '11px',
        paddingBottom: '11px',
        paddingRight: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 3,
    },
    dropDown: {
        width: '100px',
        paddingTop: '11px',
        paddingBottom: '11px',
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    dropDownItem: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: theme.palette.secondary.main,
        color: theme.palette.text.primary + ' !important',
        textAlign: 'left',
        cursor: 'pointer',
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    textFieldInput: {
        color: theme.palette.text.primary + ' !important'
    },
    textField: {
        color: theme.palette.text.primary + ' !important',
    },
    continueButton: {
        marginLeft: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
        fontSize: 14,
    },
    error: {
        width: 'fit-content',
        backgroundColor: "rgb(224,48,81)",
        marginTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    warningIcon: {
        marginRight: theme.spacing.unit,
        fontSize: 12,
        color: theme.palette.common.white
    },
    underline: {
        '&:before': {
            borderBottom: '2px solid ' + theme.palette.common.underlineContrast,
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.common.underlineFocusedContrast}`
        }
    },
    menuItem: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main + ' !important'
    },
    editButton: {
        borderColor: theme.palette.secondary.main,
        fontSize: 11,
    },
    menu: {
        backgroundColor: 'transparent !important',
        boxShadow: 'none',
        position: 'absolute',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '3px',
        borderColor: theme.palette.secondary.main,
    },
    menuItemBottomBorder: {
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.secondary.main,
    },
    balanceText: {
        color: theme.palette.common.green,
        marginTop: '5px'
    },
    fromText: {
        wordBreak: 'break-all'
    }
})

class SendStep extends Component {
    checkerInterval = null;
    constructor(props) {
        super(props);
        this.defaultCurrencies = [{ name: 'Aion', contract: null, getBalance: this.getBalance }];
        this.state = {
            currencyId: globalTokenContractRegistry.contracts.indexOf(this.props.currency) === -1 ? 0 : globalTokenContractRegistry.contracts.indexOf(this.props.currency) + this.defaultCurrencies.length,
            labelWidth: 0,
            availableCurrencies: this.defaultCurrencies.concat(globalTokenContractRegistry.contracts),
            recipient: this.props.to ? this.props.to : (this.props.defaultRecipient ? this.props.defaultRecipient : ''),
            amount: this.props.amount ? this.props.amount : (this.props.defaultAmount ? this.props.defaultAmount : ''),
            customNrg: false,
            nrgPrice: TransactionUtil.defaultNrgPrice,
            nrg: this.props.nrg ? this.props.nrg : TransactionUtil.defaultNrgLimit,
            errorMessage: this.props.errorMessage,
            account: this.props.account,
            web3: new Web3(new Web3.providers.HttpProvider(this.props.web3Provider)),
            addTokenDialogOpened: false,
        }
        globalTokenContractRegistry.account = this.props.account;
    }

    async componentDidMount() {
        let initialBalance = await this.getBalance();
        this.setState({ 
            web3: new Web3(new Web3.providers.HttpProvider(this.props.web3Provider)),
            balance: initialBalance});
        const queryParams = queryString(window.location.search);
        let platAddress;
        if (queryParams.testnet === 'true') {
            platAddress = '0xa0ae5a4854293dd64412327c7c172d911da524fc6f39fc211be7b7ecaac0185f' // note: mastery plat address is subject to change
        } else {
            platAddress = '0xa0c6ed9486e9137802d0acdcd9a0499241872f648b51a5ab49a534a0d440f62c'
        }
        this.updateCurrenciesWithAddress(platAddress, false, false)

        if (this.props.defaultTokenAddress) {
            this.updateCurrenciesWithAddress(this.props.defaultTokenAddress, true)
        }
        if (this.props.defaultAmount || this.props.defaultRecipient || this.props.defaultSender) {
            this.isFormValid()
        }
        if (this.props.privateKey === 'aiwa' ) {
            this.checkerInterval = setInterval(() => {
                if( window.aionweb3 && window.aionweb3.eth.accounts && window.aionweb3.eth.accounts[0])
                {
                    this.setState({ account: window.aionweb3.eth.accounts[0] });
                    this.isFormValid()
                }
            }, 2000)
        }
    }

    componentWillUnmount(){
        clearInterval(this.checkerInterval);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errorMessage) {
            this.setState({
                errorMessage: nextProps.errorMessage
            });
        } else if (nextProps.account) {
            this.setState({
                account: nextProps.account
            })
        }
    }

    async updateNrg(currency) {
        const {amount, recipient } = this.state;
        try {
            let estimate = 21000;
            console.log(currency);
            if(currency.getNRGEstimate){
                estimate = await currency.getNRGEstimate(recipient, amount?amount:1, '0x') + 21000 //extra gas incase estimate is too low
            }
            console.log("ESTIMATE:"+estimate)
            this.setState({ nrg: estimate });
        } catch (e) {
            console.log(e)
        }

    }
    getBalance = async () => {
        let balance = await this.state.web3.eth.getBalance(this.state.account);
        return parseFloat(this.state.web3.utils.fromNAmp(balance, 'aion')).toFixed(2)
    }

    updateCurrenciesWithAddress = async (address, skipRegistry = false, makeCurrent = true) => {
        try {
            const isJava = await isJavaToken(this.state.web3, address, this.state.account);
            const isSol = await isSolToken(this.state.web3, address)
            console.log(isSol)
            console.log(isJava)
            console.log(this.state.availableCurrencies)
            if (isJava || isSol) {
                let contractData;
                if(isSol){
                    const tokenContract = new this.state.web3.eth.Contract(ATSInterface, address)
                    contractData = {
                        name: isSol,
                        contract: tokenContract,
                        getBalance: async  () => {
                            var num = await tokenContract.methods.balanceOf(globalTokenContractRegistry.account).call();
                            return parseFloat(this.state.web3.utils.fromNAmp(num, 'aion')).toFixed(2)
                        },
                        getNRGEstimate: async (recepient, amount, data) =>{
                            return await tokenContract.methods.send(recepient,amount, data).estimateGas(recepient)
                        }
                    }
                }else{
                    const tokenContract = new this.state.web3.eth.Contract(ATSInterface, address) //update when ATS is finalized
                    contractData = {
                        name: isJava,
                        contract: tokenContract,
                        getBalance: async  () => {
                            //todo update when ATS is finilized
                            var num = await tokenContract.methods.balanceOf(globalTokenContractRegistry.account).call();
                            return parseFloat(this.state.web3.utils.fromNAmp(num, 'aion')).toFixed(2)
                        },
                        getNRGEstimate: async (recepient, amount, data) =>{
                            // todo update when ATS is finilized
                            return await tokenContract.methods.send(recepient,amount, data).estimateGas(recepient)
                        }
                    }
                }
                let foundContracts = this.state.availableCurrencies.find(item => item.contract && item.contract.address === address);
                console.log(foundContracts)
                if (!skipRegistry && foundContracts) {
                    this.setState({
                        tokenAddError: 'The Token Address already added'
                    })
                    return false;
                }
                if (!skipRegistry)
                    globalTokenContractRegistry.addContract(contractData)
                this.state.availableCurrencies.push(contractData);
                this.setState({
                    availableCurrencies: this.state.availableCurrencies,
                    tokenAddError: null,
                    addTokenSuccesfull: true
                })
                setTimeout(() => {
                    this.setState({
                        addTokenDialogOpened: false,
                        addTokenSuccesfull: true
                    })
                    setTimeout(() => {
                        this.setState({
                            addTokenSuccesfull: false
                        })
                    }, 1000)
                }, 2000)
                if (makeCurrent) {
                    this.handleCurrencyChange(this.state.availableCurrencies.length - 1)
                }
                return true;
            } else {
                this.setState({
                    tokenAddError: 'The Token Address you have entered is incorrect'
                })
                return false;
            }
        } catch (ex) {
            console.log(ex)
            this.setState({
                tokenAddError: 'The Token Address you have entered is incorrect'
            })
            return false;
        }
    }

    handleCurrencyChange = async (index) => {
        let currency = this.state.availableCurrencies[index];
        await this.updateNrg(currency)
        const balance = await currency.getBalance();
        this.setState({ currencyId: index, balance });
    };

    onRecipientEntered = (event) => {
        this.setState(
            { recipient: event.target.value },
            () => this.isFormValid()
        )
    }

    onAmountEntered = (event) => {
        this.setState(
            { amount: event.target.value },
            () => this.isFormValid()
        )
    }

    onEditNrg = () => {
        this.setState({ customNrg: true })
    }

    onNrgPriceEntered = (event) => {

        this.setState({
            nrgPrice: event.target.value
        })
    }

    onNrgLimitEntered = (event) => {

        this.setState({
            nrg: event.target.value
        })
    }

    isFormValid = () => {
        const { recipient, amount, account } = this.state;
        const { defaultSender } = this.props;
        if (defaultSender && defaultSender !== account) {

            this.setState({
                valid: false,
                errorMessage: 'Expecting a different wallet address'
            })

        } else if (typeof (recipient) === 'undefined' || recipient.length < 0 || isNaN(parseInt(amount, 10))) {
            this.setState({
                valid: false,
                errorMessage: 'Fields missing'
            })
        } else if (!this.state.web3.utils.isAddress(recipient)) {
            this.setState({
                valid: false,
                errorMessage: 'Provided address is invalid'
            })
        } else {
            this.setState({ valid: true, errorMessage: null })
        }
    }

    onTokenAddClicked = () => {
        this.setState({
            addTokenDialogOpened: true,
            tokenAddError: null
        })
    }

    onTokenAddClosed = () => {
        this.setState({
            addTokenDialogOpened: false,
            tokenAddError: null
        })
    }

    render() {
        const { classes, onSendStepBack, onSendStepContinue, checkLedger, defaultRecipient, defaultAmount } = this.props;
        const { availableCurrencies, currencyId, amount, recipient, customNrg, nrg, nrgPrice, errorMessage, valid, account, addTokenDialogOpened, tokenAddError, addTokenSuccesfull, balance } = this.state;

        return (
            <div><Grid
                container
                direction="column"
                justify="flex-start">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}> Send {availableCurrencies[currencyId].name}</Typography>
                    <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        className={classes.dropDownContainer}>
                        <Typography variant="subtitle2" className={classes.dropDownLable}>Currency:</Typography>
                        <CoinDropdown
                            selectedIndex={currencyId}
                            className={classes.dropDown}
                            itemClassName={classes.dropDownItem}
                            onChange={this.handleCurrencyChange}
                            items={availableCurrencies.map(item => item.name.toUpperCase())}
                            onTokenAddClicked={this.onTokenAddClicked}
                            lock={defaultAmount} />
                    </Grid>
                </Grid>
                <Typography variant="caption" style={{ marginTop: '25px', marginBottom: '5px' }}>FROM</Typography>
                <Typography variant="subtitle2" className={classes.balanceText}>Wallet Ballance: {balance}</Typography>
                <Typography variant="body1" className={classes.fromText}>{account}</Typography>
                <TextField
                    fullWidth
                    label="To"
                    className={classes.textField}
                    value={recipient}
                    margin="normal"
                    color="primary"
                    disabled={typeof (defaultRecipient) !== 'undefined' && defaultRecipient !== null}
                    onChange={this.onRecipientEntered.bind(this)}
                    onBlur={this.onRecipientEntered.bind(this)}
                    InputLabelProps={{
                        className: classes.textField,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.textFieldInput,
                            underline: classes.underline
                        },
                    }} />

                <TextField
                    fullWidth
                    label="Amount"
                    className={classes.textField}
                    value={amount}
                    margin="normal"
                    color="primary"
                    disabled={typeof (defaultAmount) !== 'undefined' && defaultAmount !== null}
                    type="number"
                    onChange={this.onAmountEntered.bind(this)}
                    onBlur={this.onAmountEntered.bind(this)}
                    InputLabelProps={{
                        className: classes.textField,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.textFieldInput,
                            underline: classes.underline
                        }
                    }
                    } />
                {!customNrg ?
                    <Grid spacing={8}
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        style={{ paddingTop: '15px' }}>
                        <TextField
                            disabled
                            label="MAX NRG COST"
                            value={Math.floor(nrg / 1000) + 'k NRG'}
                            className={classes.textField}
                            margin="normal"
                            style={{ width: '120px' }}
                            InputLabelProps={{
                                className: classes.textField,
                            }}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    input: classes.textFieldInput,
                                    underline: classes.underline
                                }
                            }
                            }
                        />

                        <Button variant="outlined" color="secondary" size="medium" onClick={this.onEditNrg} className={classes.editButton}><b>EDIT</b></Button>
                    </Grid>
                    : <div>
                        <Grid
                            container
                            spacing={16}
                            direction="row"
                            justify="space-evenly"
                            alignItems="center">

                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="NRG Price"
                                    className={classes.textField}
                                    value={nrgPrice}
                                    margin="normal"
                                    color="primary"
                                    type="number"
                                    onChange={this.onNrgPriceEntered}
                                    InputLabelProps={{
                                        className: classes.textField,
                                    }}
                                    InputProps={{
                                        classes: {
                                            input: classes.textFieldInput,
                                            underline: classes.underline
                                        }
                                    }
                                    } />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="NRG Limit"
                                    className={classes.textField}
                                    value={nrg}
                                    margin="normal"
                                    color="primary"
                                    type="number"
                                    onChange={this.onNrgLimitEntered}
                                    InputLabelProps={{
                                        className: classes.textField,
                                    }}
                                    InputProps={{
                                        classes: {
                                            input: classes.textFieldInput,
                                            underline: classes.underline
                                        }
                                    }
                                    } />
                            </Grid>

                        </Grid>
                    </div>}

                {
                    (errorMessage) ?
                        <Grid className={classes.error}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Grid item>
                                <Warning className={classes.warningIcon} />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">{errorMessage}</Typography>
                            </Grid>
                        </Grid> : null
                }

                {
                    (checkLedger) ?
                        <Grid className={classes.error}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Grid item>
                                <Warning className={classes.warningIcon} />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">Please confirm transaction on Ledger</Typography>
                            </Grid>
                        </Grid> : null
                }

                <Grid spacing={8}
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-start"
                    style={{ paddingTop: '25px' }}>
                    <SecondaryButton
                        onClick={onSendStepBack}
                        text='Back' />
                    <PrimaryButton
                        showArrow
                        disabled={!valid}
                        onClick={() => { onSendStepContinue(availableCurrencies[currencyId], account, recipient, parseFloat(amount, 10), nrg, nrgPrice) }}
                        className={classes.continueButton}
                        text='Continue' />
                </Grid>
            </Grid>
                <AddTokenDialog
                    open={addTokenDialogOpened}
                    onClose={this.onTokenAddClosed}
                    onTockenAddressEntered={this.updateCurrenciesWithAddress}
                    error={tokenAddError}
                    addTokenSuccesfull={addTokenSuccesfull}
                />
            </div>
        );
    }
}

SendStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onSendStepContinue: PropTypes.func.isRequired,
    onSendStepBack: PropTypes.func.isRequired,
    onRequestGasEstimate: PropTypes.func.isRequired,
};

export default withStyles(styles)(SendStep);
