import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Button, LinearProgress } from '@material-ui/core'
import { Warning, ArrowForward } from '@material-ui/icons';
const Accounts = require('aion-keystore');

const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.primary.main,
        paddingTop: '14px',
        paddingBottom: '14px',
        flexShrink: 0,
    },
    headingExpanded: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.primary.main,
        paddingTop: '0px',
        paddingBottom: '0px'
    },
    content: {
        width: '100%'
    },
    normalPanelStyle: {
        backgroundColor: theme.palette.background.default
    },
    expandedPanelStyle: {
        backgroundColor: theme.palette.background.default,
        borderStyle: 'solid',
        borderWidth: '3px',
        borderRadius: '5px',
        borderColor: 'rgb(75,229,167)'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
    },
    textField: {
        marginTop: '0px',
        marginBottom: '0px'
    },
    textFieldInput: {
        color: 'black'
    },
    privateKeyWarning: {
        width: 'fit-content',
        backgroundColor: "rgb(224,125,8)",
        marginTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    privateKeyError: {
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
    rightIcon: {
        marginLeft: theme.spacing.unit,
        fontSize: 14,
    },
    continueButton: {
        float: 'right',
        marginTop: theme.spacing.unit * 4,
        backgroundColor: 'rgb(31,133,163)'
    },
    progressBarContainer: {
        position: 'relative',
        width: '330px',
    },
    progressBar: {
        borderRadius: '6px',
        height: '10px',
        position: 'relative',
        left: 0,
        right: 0,
    },
    progressBarBar: {
        backgroundColor: 'rgb(80,241,175)'
    }
})
class WalletProvidersStep extends Component {


    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            privateKey: null,
            completed: 0,
            privateKeyError: false,
            privateKeyErrorMessage: 'Using a private key online is not safe'
        }
        this.CONTENT_ITEMS = [
            {
                title: 'Ledger',
                create: this.createLedgerPanel,
                unlock: this.unlockLedger,
                validate: this.validateLedger
            },
            {
                title: 'Key Store File',
                create: this.createKeyStorePanel,
                unlock: this.unlockKeyStore,
                validate: this.validateKeystoreFile
            },
            {
                title: 'Private Key',
                create: this.createPrivateKeyPanel,
                unlock: this.unlockPrivateKey,
                validate: this.validatePrivateKey
            }
        ];
    }

    componentDidMount() { }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    onPrivateKeyEntered = (text) => {
        this.setState({ privateKey: text })
    }
    unlockAccount = (item) => {
        let data = item.unlock() // could be a promise
        if(!data) return;

        const timer = setInterval(() => { //fake loading
            if (this.state.completed > 100) {
                clearInterval(timer);
                this.props.onAccountImported(data)
            } else {
                this.setState({ completed: this.state.completed + 25 })
            }
        }, 500);

    }
    unlockLedger = () => {
        return { data: 'todo:integrate' }
    }
    unlockKeyStore = () => {
        return { data: 'todo:integrate' }
    }

    unlockPrivateKey=()=>{
        try{
            const aion = new Accounts();
            let account = aion.privateKeyToAccount(this.state.privateKey);
            return account;
        }catch(e){
            this.setState({privateKeyError: true, privateKeyErrorMessage: "Invalid key"})
            return false;
        }
    }

    createLedgerPanel= (classes)=>{
        return(<div className={classes.content}>Todo Ledger</div>)
    }
    createKeyStorePanel = (classes) => {
        return (<div className={classes.content}>Todo Key store file</div>)
    }
    createPrivateKeyPanel = (classes) => {
        return (<div className={classes.content}>
            <TextField
                fullWidth
                label="Enter Private Key"
                className={classes.textField}
                margin="normal"
                color="secondary"
                type="password"
                onChange={(event) => this.onPrivateKeyEntered(event.target.value)}
                InputProps={{
                    classes: {
                        input: classes.textFieldInput,
                    },
                }}
            />
            <br />
            <Grid className={(this.state.privateKeyError) ? classes.privateKeyError : classes.privateKeyWarning}
                container
                direction="row"
                justify="flex-start"
                alignItems="center">
                <Grid item>
                    <Warning className={classes.warningIcon} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{this.state.privateKeyErrorMessage}</Typography>
                </Grid>
            </Grid>
        </div>);
    }

    validateLedger = () => {
        return false;//todo
    }
    validateKeystoreFile = () => {
        return false;//todo
    }
    validatePrivateKey = () => {
        const { privateKey } = this.state;
        return privateKey !== null && privateKey.length > 0;//todo
    }
    render() {
        const { classes } = this.props;
        const { expanded, completed } = this.state;

        let content;
        if (completed === 0) { //Wallet Import Options
            const innerContent = this.CONTENT_ITEMS.map((item, index) => {

                return (<Grid key={index} item>
                    <ExpansionPanel className={expanded === item ? classes.expandedPanelStyle : classes.normalPanelStyle} expanded={expanded === item} onChange={this.handlePanelChange(item)}>
                        <ExpansionPanelSummary>
                            <Typography className={expanded === item ? classes.headingExpanded : classes.heading}>{item.title.toUpperCase()}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {item.create(classes)}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>);
            });
            content = (<Grid spacing={8}
                container
                direction="column"
                justify="flex-start">

                <Typography variant="h6" style={{ fontWeight: 'bold' }}>AION PAY</Typography>
                <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '25px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet.</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '25px', marginBottom: '25px' }}> Choose your wallet provider</Typography>
                {innerContent}
                {expanded ?
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!expanded.validate()}
                            className={classes.continueButton}
                            onClick={() => this.unlockAccount(expanded)}>
                            <b>Continue</b>
                            <ArrowForward className={classes.rightIcon} />
                        </Button>
                    </Grid>
                    : null}

            </Grid>)

        } else { //Unlocking progress screen
            content = (<Grid spacing={8}
                container
                direction="column"
                justify="center"
                alignItems="center">
                <Typography variant="h5" style={{ fontWeight: 'bold', marginTop: '25px', marginBottom: '25px' }}>Unlocking {expanded.title}...</Typography>
                <div className={classes.progressBarContainer}>
                    <LinearProgress
                        variant="determinate"
                        value={this.state.completed}
                        className={classes.progressBar}
                        classes={{ bar: classes.progressBarBar }} />
                </div>
            </Grid>)
        }

        return (content);
    }
}

WalletProvidersStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onAccountImported: PropTypes.func.isRequired
};

export default withStyles(styles)(WalletProvidersStep);
