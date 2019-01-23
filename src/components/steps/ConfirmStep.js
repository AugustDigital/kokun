import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'aion-web3';
import { withStyles, Typography, Grid, Button, Paper } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons';
import AionLogoLight from '../../assets/aion_logo_light.svg'
import Provider from '../../../global_config'

const styles = theme => ({
    paper: {
        backgroundColor: theme.palette.background.default,
        marginTop: theme.spacing.unit * 5,
        padding: theme.spacing.unit * 3
    },
    fatLable: {
        fontWeight: 'bold',
        marginRight: theme.spacing.unit * 2
    },
    thinLable: {
        fontWeight: 300
    },
    transactionRow: {
        marginTop: theme.spacing.unit * 1
    },
    continueButton: {
        backgroundColor: theme.palette.common.primaryButton,
        marginLeft: theme.spacing.unit * 4
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
        fontSize: 14,
    },
})
class ConfirmStep extends Component {


    constructor(props) {
        super(props);
        this.state = {
            web3: null
        }
    }

    componentDidMount() {
        this.setState({ web3: new Web3(new Web3.providers.HttpProvider(Provider))});
    }

    async sendTransaction(){
        try{
            const transactionHash = await this.state.web3.eth.sendRawTransaction(this.props.rawTransaction)
            this.props.onTransactionStepContinue(transactionHash)
        }catch(error){
            console.log(error)
        }
    }

    render() {
        const { classes, currency, to, from, amount, nrg, nrgPrice, nrgLimit, rawTransaction, onTransactonStepBack } = this.props;
        const { completed } = this.state;
        return (
            <div>
                    <Grid spacing={0}
                        container
                        direction="column"
                        justify="flex-start">
                        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '25px' }}>Confirm Transaction</Typography>
                        <Paper className={classes.paper}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center">
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>TO</Typography>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.thinLable}>{to}</Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.transactionRow}>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>FROM</Typography>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.thinLable}>{from}</Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.transactionRow}>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>AMOUNT</Typography>
                                <Typography color="textSecondary" variant="subtitle2" style={{ fontWeight: 'bold' }}>{amount}</Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.transactionRow}>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>NRG</Typography>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.thinLable}>{nrg}</Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.transactionRow}>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>NRG PRICE</Typography>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.thinLable}>{nrgPrice}</Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.transactionRow}>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.fatLable}>Maximum NRG</Typography>
                                <Typography color="textSecondary" variant="subtitle2" className={classes.thinLable}>{nrgLimit}</Typography>
                            </Grid>
                        </Paper>
                        <Grid
                            container
                            spacing={0}
                            wrap="wrap"
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                            style={{ marginTop: '25px' }}>
                            <Grid item>
                                <Typography variant="subtitle2" className={classes.fatLable}>Raw Transaction</Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="subtitle2" className={classes.thinLable} style={{ wordBreak: 'break-all' }}>{rawTransaction}</Typography>
                            </Grid>
                        </Grid>
                        <Grid spacing={8}
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-start"
                            style={{ paddingTop: '45px' }}>
                            <Button
                                variant="outlined"
                                onClick={onTransactonStepBack}>
                                <b>Back</b>
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.sendTransaction.bind(this)}
                                className={classes.continueButton}>
                                <b>Continue</b>
                                <ArrowForward className={classes.rightIcon} />
                            </Button>
                        </Grid>
                    </Grid>

            </div>

        );
    }
}

ConfirmStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onTransactionStepContinue: PropTypes.func.isRequired,
    onTransactonStepBack: PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    nrg: PropTypes.number.isRequired,
    //nrgPrice: PropTypes.number.isRequired, uncomment if needed
    //nrgLimit: PropTypes.number.isRequired,
    rawTransaction: PropTypes.string.isRequired,
    web3Provider:PropTypes.string.isRequired,
};

export default withStyles(styles)(ConfirmStep);
