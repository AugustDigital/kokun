import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField, Button} from '@material-ui/core';

import {KeyterpillarContract} from '../../../global_config'
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
    }
})

class LoginStep extends Component {
    state={
        userName:'',
        password:'',
    }
    onUsernameKeyEntered=(text)=>{
        this.setState({ userName: text })
    }
    onPasswordEntered = (text) => {
        this.setState({ password: text })
    }
    onTryLogin =(userName, password)=>{
        const contract = this.props.web3.eth.contract(KeyterpillarContract.abi).at(KeyterpillarContract.address);
        const keyIndex = contract.getKeyIndexesWithType.call(userName,0)[0].toNumber();
        const key=contract.getKey.call(userName,keyIndex)[0];
        this.props.onLogin(key, password)
    }
    render() {
        const { classes, onShowRegister } = this.props;
        const {password, userName} = this.state;
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
            <Button 
                size="small"  
                className={classes.registerButton} 
                onClick={onShowRegister}>
                Register
            </Button>
            <Button 
                size="small"  
                className={classes.registerButton} 
                onClick={()=>{this.onTryLogin(userName,password)}}>
                Login
            </Button>
        </div>)
    }
}

LoginStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onShowRegister: PropTypes.func.isRequired,
};


export default withStyles(styles)(LoginStep);