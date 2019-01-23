import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'aion-web3';
import { withStyles, Typography, TextField, Grid, Button, FormControl, Select, MenuItem } from '@material-ui/core'
import { Warning, ArrowForward } from '@material-ui/icons';
import * as TransactionUtil from '../../utils/TransactionUtil';
import Provider from '../../../global_config'

const styles = theme => ({
    dropDownContainer: {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '3px',
        borderColor: theme.palette.common.white,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    dropDownLable: {
        borderRight: '1px solid '+theme.palette.divider,
        fontWeight: 'light',
        float: 'left',
        position: 'reltive',
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    dropDown: {
        paddingLeft: theme.spacing.unit * 2,
        marginTop: '4px'
    },
    textFieldInput: {
        color: 'white !important'
    },
    textField: {
        color: 'white !important',
    },
    continueButton: {
        backgroundColor: theme.palette.common.primaryButton,
        marginLeft: theme.spacing.unit * 4
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
        color: "#fff"
    },
})
class SendStep extends Component {

    state = {
        currencyId: 0,
        labelWidth: 0,
        availableCurrencies: ['Aion', 'Plat'],
        recipient: this.props.to ? this.props.to : '',
        amount: this.props.amount ? this.props.amount : '',
        customNrg: false,
        nrgPrice: TransactionUtil.defaultNrgPrice,
        nrgLimit: TransactionUtil.defaultNrgLimit,
        nrg: this.props.nrg ? this.props.nrg : TransactionUtil.defaultNrgLimit,
        error: false,
        errorMessage: '',
        account: this.props.account
    }

    componentDidMount() {
        this.setState({ web3: new Web3(new Web3.providers.HttpProvider(Provider))});
    }

    async updateNrg(from, to, amount) {

        try{
            let totalAions = this.state.web3.toWei(amount, "ether");
            let transaction = { from: from, to: to, value: totalAions };
            let estimatedNrg = this.state.web3.eth.estimateGas(transaction);
            this.setState({ nrg: estimatedNrg });
        }catch(e){
            console.log(e)
        }

    }

    handleCurrencyChange = event => {
        this.setState({ [event.target.name]: event.target.value });
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
        this.updateNrg(this.state.account, this.state.recipient, this.state.amount);
    }

    onNrgLimitEntered = (event) => {

        this.setState({
            nrgLimit: event.target.value
        })
        this.updateNrg(this.state.account, this.state.recipient, this.state.amount);
    }

    isFormValid = () => {
        const { account, recipient, amount, nrg } = this.state;

        if (typeof (recipient) === 'undefined' || recipient.length < 0 || isNaN(parseInt(amount, 10))) {
            this.setState({
                valid: false,
                error: true,
                errorMessage: 'Fields missing'
            })
        } else {
            this.setState({ error: false, valid: true, errorMessage: '' })
        }
    }

    render() {
        const { classes, onSendStepBack, onSendStepContinue, checkLedger, defaultRecipient } = this.props;
        const { availableCurrencies, currencyId, amount, recipient, customNrg, nrg, nrgLimit, nrgPrice, error, errorMessage, valid, account } = this.state;

        const dropDownItems = availableCurrencies.map((item, index) => {
            return (<MenuItem key={index} value={index}>{item}</MenuItem>)
        })

        return (
            <Grid
                container
                direction="column"
                justify="flex-start">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}> Send {availableCurrencies[currencyId]}</Typography>
                    <div className={classes.dropDownContainer}>

                        <Typography variant="subtitle2" className={classes.dropDownLable}>Currency:</Typography>
                        <span >
                            <FormControl className={classes.dropDown}>
                                <Select
                                    disableUnderline={true}
                                    value={this.state.currencyId}
                                    onChange={this.handleCurrencyChange}
                                    name="currencyId">
                                    {dropDownItems}
                                </Select>
                            </FormControl>
                        </span>

                    </div>

                </Grid>
                <TextField
                    disabled
                    id="standard-disabled"
                    label="FROM"
                    value={account}
                    className={classes.textField}
                    style={{ marginTop: '45px' }}
                    margin="normal"
                    InputLabelProps={{
                        className: classes.textField
                    }}
                    InputProps={{
                        disableUnderline: true,
                        classes: {
                            input: classes.textFieldInput,
                        }
                    }
                    }
                />
                <TextField
                    fullWidth
                    label="To"
                    className={classes.textField}
                    value={defaultRecipient?defaultRecipient:recipient}
                    margin="normal"
                    color="primary"
                    disabled={defaultRecipient}
                    onChange={this.onRecipientEntered.bind(this)}
                    onBlur={this.onRecipientEntered.bind(this)}
                    InputLabelProps={{
                        className: classes.textField,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.textFieldInput,
                        },
                    }} />

                <TextField
                    fullWidth
                    label="Amount"
                    className={classes.textField}
                    value={amount}
                    margin="normal"
                    color="primary"
                    type="number"
                    onChange={this.onAmountEntered.bind(this)}
                    onBlur={this.onAmountEntered.bind(this)}
                    InputLabelProps={{
                        className: classes.textField,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.textFieldInput,
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
                            id="standard-disabled"
                            label="MAX NRG COST"
                            value={nrg}
                            className={classes.textField}
                            margin="normal"
                            InputLabelProps={{
                                className: classes.textField,
                            }}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    input: classes.textFieldInput,
                                }
                            }
                            }
                        />

                        <Button variant="outlined" onClick={this.onEditNrg}>EDIT</Button>
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
                                        }
                                    }
                                    } />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="NRG Limit"
                                    className={classes.textField}
                                    value={nrgLimit}
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
                                        }
                                    }
                                    } />
                            </Grid>

                        </Grid>
                    </div>}

                {
                    (error) ?
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
                    </Grid> :null
                }

                <Grid spacing={8}
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-start"
                    style={{ paddingTop: '25px' }}>
                    <Button
                        variant="outlined"
                        onClick={onSendStepBack}>
                        <b>Back</b>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!valid}
                        onClick={() => { onSendStepContinue(availableCurrencies[currencyId], account, recipient, parseFloat(amount, 10), nrg, nrgPrice, nrgLimit) }}
                        className={classes.continueButton}>
                        <b>Continue</b>
                        <ArrowForward className={classes.rightIcon} />
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

SendStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onSendStepContinue: PropTypes.func.isRequired,
    onSendStepBack: PropTypes.func.isRequired
};

export default withStyles(styles)(SendStep);
