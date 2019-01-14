import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Grid, Typography } from '@material-ui/core'
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
import { CheckCircleRounded } from '@material-ui/icons'
const styles = theme => ({
    continueButton: {
        float: 'right',
        marginTop: theme.spacing.unit * 4,
        backgroundColor: 'rgb(31,133,163)'
    },
    checkIcon: {
        fontSize: 84,
        color: 'rgb(80,241,175)'
    }
})
class UserTool extends Component {

    state = {
        step: 0,//todo switch back to 0 after testing
        transactionData: {

        }
    }

    componentDidMount() { }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
            transactionData: null
        });
    };
    onAccountImported = (account) => {
        this.setState({
            account: account,
            step: 1
        })
    }
    onSendStepContinue = (currency, from, to, amount, nrg, nrgPrice, nrgLimit, rawTransaction) => {
        this.setState({
            step: 2,
            transactionData: { currency, from, to, amount, nrg, nrgPrice, nrgLimit, rawTransaction }
        })
    }
    onSendStepBack = () => {
        this.setState({
            step: 0
        })
    }

    onTransactionStepContinue = (txHash) => {

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
        const { step, transactionData, txHash } = this.state;
        let content = null;


        console.log(transactionData)
        switch (step) {
            case 0: { // Account import
                content = (<WalletProvidersStep
                    onAccountImported={this.onAccountImported}
                />);
                break;
            }
            case 1: { // Send 
                content = (<SendStep
                    onSendStepContinue={this.onSendStepContinue}
                    onSendStepBack={this.onSendStepBack}
                    currency={transactionData.currency}//following data is in the case of 'back' navigation
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    nrgLimit={transactionData.nrgLimit}
                    rawTransaction={transactionData.rawTransaction}
                />);
                break;
            }
            case 2: { // Confirm
                content = (<ConfirmStep
                    onTransactonStepContinue={this.onTransactionStepContinue}
                    onTransactonStepBack={this.onTransactionStepBack}
                    currency={transactionData.currency}
                    from={transactionData.from}
                    to={transactionData.to}
                    amount={transactionData.amount}
                    nrg={transactionData.nrg}
                    nrgPrice={transactionData.nrgPrice}
                    nrgLimit={transactionData.nrgLimit}
                    rawTransaction={transactionData.rawTransaction}
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
                        <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '20px' }}> Transaction Hash: <a href={'https://mastery.aion.network/#/transaction/' + txHash}>{txHash}</a></Typography>
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
