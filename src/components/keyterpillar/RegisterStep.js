import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField, Button, InputAdornment, IconButton} from '@material-ui/core';
import {Autorenew} from '@material-ui/icons'
const Accounts = require('aion-keystore')
const styles = theme => ({
    root:{

    },
    content: {
        width: '100%'
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
        backgroundColor: theme.palette.background.warning,
        marginTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    warningText:{
        color:theme.palette.common.white
    },
    privateKeyError: {
        width: 'fit-content',
        backgroundColor: theme.palette.background.error,
        marginTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    registerButton:{
        color:theme.palette.text.secondary,
        marginTop:theme.spacing.unit * 2,
    },
    generatePK:{
        color:"green"
    }
})

class RegisterStep extends Component {
    state={
        userName:'',
        password:'',
        pk:'',
        address:null,
    }
    onUsernameKeyEntered=(text)=>{
        this.setState({ userName: text })
    }
    onPasswordEntered = (text) => {
        this.setState({ password: text })
    }
    onGenerateAccount = () => {
        var enc = new TextEncoder();
        const aion = new Accounts();
        const account = aion.create(enc.encode(Date.now()+"+"+Date.now()+":seed"));
        console.log(account)
        this.setState({
            pk:account.privateKey.substr(2),
            address:account.address})
    }
    onPkEntered = (text) =>{
        console.log("entered:"+text)
        this.setState({pk:text})
    }
    render() {
        const { classes, onCancelRegistration, onRegisterPKNamePass } = this.props;
        const {password, userName, pk, address} = this.state;
        return(<div className={classes.content}>
            <TextField
                label="Enter Username"
                className={classes.textField}
                margin="normal"
                color="secondary"
                value={userName}
                onChange={(event) => this.onUsernameKeyEntered(event.target.value)}
                InputProps={{
                    classes: {
                        input: classes.textFieldInput,
                        underline: classes.underline
                    },
                }}
                InputLabelProps={{
                    classes:{root:classes.inputPlaceholder},
                }}
            />
            <br/>
            <TextField
                label="Enter Password"
                className={classes.textField}
                margin="normal"
                color="secondary"
                value={password}
                type="password"
                onChange={(event) => this.onPasswordEntered(event.target.value)}
                InputProps={{
                    classes: {
                        input: classes.textFieldInput,
                        underline: classes.underline
                    },
                }}
                InputLabelProps={{
                    classes:{root:classes.inputPlaceholder},
                }}
            />
            <br/>
            <TextField
                label="Enter Private Key"
                className={classes.textField}
                margin="normal"
                color="secondary"
                value={pk}
                onChange={(event) => this.onPkEntered(event.target.value)}
                InputProps={{
                    classes: {
                        input: classes.textFieldInput,
                        underline: classes.underline
                    },
                    endAdornment:(
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.onGenerateAccount.bind(this)}
                          >
                          <Autorenew className={classes.generatePK}/>
                          </IconButton>
                        </InputAdornment>
                    )
                }}
                InputLabelProps={{
                    classes:{root:classes.inputPlaceholder},
                }}
            />
            {address?<div style={{fontSize:'12px'}}>
                Address:{address}
            </div>:null}
            <br/>
            <Button onClick={onCancelRegistration} size="small" className={classes.registerButton}>
                Cancel
            </Button>
            <Button onClick={()=>{onRegisterPKNamePass(pk, userName, password)}} size="small" className={classes.registerButton}>
                Submit
            </Button>
        </div>)
    }
}

RegisterStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onCancelRegistration:  PropTypes.func.isRequired,
    onRegisterPKNamePass: PropTypes.func.isRequired,
};


export default withStyles(styles)(RegisterStep);