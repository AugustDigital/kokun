import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Button, LinearProgress, IconButton, Zoom } from '@material-ui/core'
import { Warning, ArrowForward, CloudUpload, InsertDriveFile, CheckCircleRounded, Close, Dock } from '@material-ui/icons';
import classNames from 'classnames'
import Dropzone from 'react-dropzone';
import KeystoreWalletProvider from '../../utils/KeystoreWalletProvider';
import AionLogoLight from '../../assets/aion_logo_light.svg'
import LockIcon from '../../assets/lock_icon.svg'
import LedgerProvider from '../../utils/ledger/LedgerProvider'
import {promiseTimeout} from '../../utils/promiseTimeout';

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
        backgroundColor: theme.palette.background.white
    },
    expandedPanelStyle: {
        backgroundColor: theme.palette.background.white,
        borderStyle: 'solid',
        borderWidth: '4px',
        borderRadius: '5px',
        borderColor: theme.palette.common.green
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
        marginBottom: theme.spacing.unit * 2,
        backgroundColor: theme.palette.common.primaryButton,
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
        backgroundColor: theme.palette.common.green
    },
    cancelFileUploadButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    fileIcon: {
        color: theme.palette.common.icon,
        fontSize: 85,
    },
    checkIcon: {
        fontSize: 16,
        color: theme.palette.common.green
    },
    uploadIcon: {
        color: theme.palette.common.icon,
        fontSize: 85,
    },
    uploadIconHover: {
        color: 'rgb(27,199,254)',
        fontSize: 85,
    },
    checkIconBig: {
        fontSize: 85,
        color: theme.palette.common.green
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    iconHeading: {
        float: 'left'
    },
    unlockingState: {
        paddingTop: theme.spacing.unit * 15,
        paddingBottom: theme.spacing.unit * 15
    }
})
class WalletProvidersStep extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            privateKey: null,
            keyStoreFile: null,
            keyStoreFilePass: null,
            ledgerConnected: false,
            ledgerAddress: '',
            completed: 0,
            privateKeyError: false,
            privateKeyErrorMessage: 'Using a private key online is not safe',
            keyStoreError: false,
            keyStoreErrorMessage: ''
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
    componentDidMount() {
        const timer = setInterval(() => {
            if(this.state.expanded != null){
                let expanded={title:''};
                expanded = this.state.expanded;
                if(expanded.title == "Ledger"){
                    let doIt = promiseTimeout(3000, this.connectToLedger());
                    doIt.then(result => {
                        if(result){
                            this.setState({ledgerConnected: true , ledgerAddress: result})
                        }else{
                            this.setState({ledgerConnected: false, ledgerAddress: ''});
                        }
                    }).catch(error => {
                        this.setState({ledgerConnected: false, ledgerAddress: ''});
                    });
                }
            }
        }, 5000);
    }
     connectToLedger(){
         return new Promise((resolve, reject) => {

            let ledgerConnection = new LedgerProvider();
            ledgerConnection.unlock(null).then((address) => {
                resolve(address[0]);
            }).catch((error) => reject(error))
        })
     }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    onPrivateKeyEntered = (text) => {
        this.setState({ privateKey: text })
    }
    onKeystoreFileUploaded = (acceptedFiles, rejectedFiles) => {
        //todo: check if file is valid
        this.setState({ keyStoreFile: acceptedFiles[0] })
    }
    onKeystorePasswordEntered = (text) => {
        this.setState({ keyStoreFilePass: text })
    }
    onCancelFileUpload = () => {
        this.setState({
            keyStoreFile: null,
            keyStoreFilePass: null
        })
    }
    unlockAccount = (item) => {
        item.unlock().then((result)=>{
            this.props.onAccountImported(result)
        }).catch((error)=>{
            return error;
        })
    }
    unlockLedger = () => {
        return new Promise((resolve, reject) => {
            resolve({address: this.state.ledgerAddress, privateKey: 'ledger' })
        })
    }
    unlockKeyStore = () => {

        return new Promise((resolve, reject) => {
            let reader = new FileReader()

            try {
              reader.readAsArrayBuffer(this.state.keyStoreFile)
            } catch (error) {
              reject(error)
            }

            let me = this;
            reader.onload =  async function () {
                let content = reader.result;
                let keystoreProvider = new KeystoreWalletProvider(content, me.state.keyStoreFilePass);

                try {
                  let [address, publicKey, privateKey] = await keystoreProvider.unlock((progress) => {
                      me.setState({ completed: Math.round(progress) });
                  })

                  resolve({address: address, privateKey: privateKey })
                } catch (error) {
                  me.setState({keyStoreError: true, keyStoreErrorMessage: "Unable to unlock file"})
                  reject(error)
                }
            }
        })
    }

    unlockPrivateKey=()=>{
        return new Promise((resolve, reject) => {
            try{
                const aion = new Accounts();
                let account = aion.privateKeyToAccount(this.state.privateKey);
                const timer = setInterval(() => {
                    if (this.state.completed == 100) {
                        clearInterval(timer);
                        resolve(account)
                    } else {
                        this.setState({ completed: this.state.completed + 25 })
                    }
                }, 500);

            }catch(e){
                this.setState({privateKeyError: true, privateKeyErrorMessage: "Invalid key"})
                reject(false)
            }
        })
    }

    createLedgerPanel = (classes) => {
        return (<div className={classes.content}>
            {this.state.ledgerConnected ? <div>
                <Grid
                    container
                    spacing={16}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ marginTop: '15px' }}>

                    <CheckCircleRounded className={classes.checkIconBig} />
                    <Typography color='textSecondary' variant='h5'>Ledger connected</Typography>
                </Grid>
            </div> :
                <Grid
                    container
                    spacing={16}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ marginTop: '15px' }}>

                    <Dock className={classes.fileIcon} />
                    <Typography color='textSecondary' variant='h5' >Connect your Ledger device</Typography>
                </Grid>
            }


        </div>)
    }
    createKeyStorePanel = (classes) => {
        return (<div className={classes.content}>
            {this.state.keyStoreFile ?
                <div>
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <InsertDriveFile className={classes.fileIcon} />
                        <Typography color='textSecondary' variant='h5' style={{ fontWeight: 'bold', marginTop: '15px' }}>{this.state.keyStoreFile.name}</Typography>

                    </Grid>
                    <IconButton onClick={this.onCancelFileUpload} aria-label="Close" className={classes.cancelFileUploadButton}>
                        <Close color='primary' />
                    </IconButton>
                    <Grid
                        container
                        spacing={16}
                        direction="row"
                        justify="center"
                        alignItems="center"
                        style={{ marginTop: '15px' }}
                    >
                        <Typography color='textSecondary' variant="subtitle2" style={{ fontWeight: 'light' }}>Uploaded Successfully</Typography>
                        <CheckCircleRounded className={classes.checkIcon} />
                    </Grid>
                    <TextField
                        fullWidth
                        label="PASSWORD"
                        className={classes.textField}
                        margin="normal"
                        color="secondary"
                        type="password"
                        onChange={(event) => this.onKeystorePasswordEntered(event.target.value)}
                        InputProps={{
                            classes: {
                                input: classes.textFieldInput,
                            },
                        }}
                    />
                </div> :
                <Dropzone onDrop={this.onKeystoreFileUploaded}>
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return (
                            <div
                                {...getRootProps()}
                                className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}>
                                <input {...getInputProps()} />
                                <Grid container
                                    direction="column"
                                    justify="center"
                                    alignItems="center">
                                    <CloudUpload className={isDragActive ? classes.uploadIconHover : classes.uploadIcon} />
                                    <Typography color='textSecondary' variant='h5'>Drag and drop to upload your file</Typography>
                                    <Typography color='textSecondary' variant="subtitle2" style={{ fontWeight: 'light', marginTop: '15px' }}>or <span style={{ color: 'rgb(27,199,254)' }}><a href={null}>browse</a></span> to choose a file</Typography>
                                </Grid>

                            </div>
                        )
                    }}
                </Dropzone>
            }

        </div>)
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

        const {ledgerConnected} = this.state;
        return ledgerConnected;
    }
    validateKeystoreFile = () => {
        const { keyStoreFile, keyStoreFilePass } = this.state;
        return keyStoreFile != null && keyStoreFilePass !== null && keyStoreFilePass.length > 0;
    }
    validatePrivateKey = () => {
        const { privateKey } = this.state;
        return privateKey !== null && privateKey.length > 0;
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
                        <ExpansionPanelDetails style={{ marginTop: '-20px' }}>
                            {item.create(classes)}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    {expanded === item ?
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
                </Grid>);
            });
            content = (<Grid spacing={8}
                container
                direction="column"
                justify="flex-start">

                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    <img alt="Aion Logo" className={classNames(classes.leftIcon, classes.iconSmall, classes.iconHeading)} src={AionLogoLight} />
                    AION PAY</Typography>
                <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '25px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet.</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '25px', marginBottom: '25px' }}> Choose your wallet provider</Typography>
                {innerContent}
            </Grid>)

        } else { //Unlocking progress screen
            content = (<Grid spacing={8}
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.unlockingState}>
                <Zoom in={true}>
                    <img alt='Lock' src={LockIcon} width='50px'/>
                </Zoom>
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
