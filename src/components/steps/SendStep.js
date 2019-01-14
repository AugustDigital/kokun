import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, Grid, Button, FormControl, Select, MenuItem } from '@material-ui/core'
import { Warning, ArrowForward } from '@material-ui/icons';
import * as TransactionUtil from '../../utils/TransactionUtil';

const styles = theme => ({
    dropDownContainer: {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '3px',
        borderColor: 'rgb(255,255,255)',
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    dropDownLable: {
        borderRight: '1px solid rgba(255,255,255,0.2)',
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
        backgroundColor: 'rgb(31,133,163)',
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


    constructor(props) {
        super(props);
        this.state = {
            currencyId: 0,
            labelWidth: 0,
            availableCurrencies: ['Aion', 'Plat'],
            recipient: '',
            amount: '',
            account: this.props.account,
            nrg: TransactionUtil.defaultNrgLimit,
            nrgPrice: TransactionUtil.defaultNrgPrice,
            error: false,
            errorMessage: '',
            valid: false
        }
    }


    componentDidMount() {

    }

    componentWillReceiveProps(props) {
        this.setState({
            recipient: props.to,
            amount: props.amount,
        })
    }

    handleCurrencyChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event)
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
        //todo
    }

    isFormValid = () =>{
        const {account, recipient, amount, nrg} = this.state;

        if(typeof (recipient) == 'undefined' || recipient.length < 0 || isNaN(parseInt(amount,10))){
            this.setState({
                valid: false,
                error: true,
                errorMessage: 'Fields missing'
            })
        }else{
            this.setState({error: false, valid: true, errorMessage:''})
        }
    }

    render() {
        const { classes, onSendStepBack, onSendStepContinue } = this.props;
        const { availableCurrencies, currencyId, amount, recipient, nrg, nrgPrice, account, error, errorMessage} = this.state;

        const dropDownItems = availableCurrencies.map((item, index) => {
            return (<MenuItem key={index} value={index}>{item}</MenuItem>)
        })

        return (
            <Grid spacing={8}
                container
                direction="column"
                justify="flex-start">
                <Grid spacing={8}
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
                    value={this.state.account}
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
                    value={recipient}
                    margin="normal"
                    color="primary"
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
                        disabled={!this.state.valid}
                        onClick={() => { onSendStepContinue(availableCurrencies[currencyId], account, recipient, parseFloat(amount, 10), nrg, nrgPrice, nrg) }}
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
