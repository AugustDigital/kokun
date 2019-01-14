import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Button, LinearProgress } from '@material-ui/core'
import { Warning, ArrowForward } from '@material-ui/icons';
const Accounts = require('aion-keystore');

const CONTENT_ITEMS = ['LEDGER', 'KEY STORE FILE', 'PRIVATE KEY'];
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
        background: '#ffffff',
    },
    expandedPanelStyle: {
        background: '#ffffff',
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
    }
})
class WalletProvidersStep extends Component {

    state = {
        expanded: null,
        privateKey: null,
        publicKey: null,
        completed: 0,
        privateKeyError: false,
        privateKeyErrorMessage: 'Using a private key online is not safe'
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
    isValidData = (expandedPanel) => {
        switch (expandedPanel) {
            case CONTENT_ITEMS[0]: {
                //todo
                return false;
            }
            case CONTENT_ITEMS[1]: {
                //todo
                return false;
            }
            case CONTENT_ITEMS[2]: {
                return this.state.privateKey !== null && this.state.privateKey.length > 0
            }
        }
    }
    unlockAccount = () => {

        const { expanded } = this.state;
        //todo unlock account there
        switch (expanded) {
            case CONTENT_ITEMS[0]: {
                //todo unlock ledger
                break;
            }
            case CONTENT_ITEMS[1]: {
                //todo unlock keystore file
                break;
            }
            case CONTENT_ITEMS[2]: {
                try{
                    const aion = new Accounts();
                    let account = aion.privateKeyToAccount(this.state.privateKey);
                    this.setState({publicKey: account})
                }catch(e){
                    this.setState({privateKeyError:true, privateKeyErrorMessage: 'Invalid key'})
                    return;
                }
                break;
            }
        }
        const timer = setInterval(() => {
            if (this.state.completed === 100) {
                clearInterval(timer);
                this.props.onAccountImported({ data: 'todo' })
            } else {
                this.setState({ completed: this.state.completed + 10 })
            }

        }, 500);

    }
    render() {
        const { classes } = this.props;
        const { expanded, completed } = this.state;
        const content = CONTENT_ITEMS.map((item, index) => {
            let detail;
            switch (item) {
                case CONTENT_ITEMS[0]: {
                    detail = (<div>Todo Ledger</div>);
                    break;
                }
                case CONTENT_ITEMS[1]: {
                    detail = (<div>Todo Key store file</div>);
                    break;
                }
                case CONTENT_ITEMS[2]: {
                    detail = (
                        <div className={classes.content}>
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
                        </div>
                    );
                    break;
                }
                default: {
                    detail = (null);
                    break;
                }
            }
            return (<Grid key={index} item>
                <ExpansionPanel className={expanded === item ? classes.expandedPanelStyle : classes.normalPanelStyle} expanded={expanded === item} onChange={this.handlePanelChange(item)}>
                    <ExpansionPanelSummary>
                        <Typography className={expanded === item ? classes.headingExpanded : classes.heading}>{item}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {detail}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>);
        })
        return (<div>
            {completed === 0 ?
                <Grid spacing={8}
                    container
                    direction="column"
                    justify="flex-start">

                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>AION PAY</Typography>
                    <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '25px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet.</Typography>
                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '25px', marginBottom: '25px' }}> Choose your wallet provider</Typography>
                    {content}
                    {expanded ?
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!this.isValidData(expanded)}
                                className={classes.continueButton}
                                onClick={this.unlockAccount}>
                                Continue
                        <ArrowForward className={classes.rightIcon} />
                            </Button>
                        </Grid>
                        : null}

                </Grid>
                : <LinearProgress variant="determinate" value={this.state.completed} />}

        </div>);
    }
}

WalletProvidersStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onAccountImported: PropTypes.func.isRequired
};

export default withStyles(styles)(WalletProvidersStep);
