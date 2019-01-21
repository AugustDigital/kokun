import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AionLogoLight from '../assets/aion_logo_light.svg'

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    button:{
        backgroundColor: theme.palette.background.aionPay+' !important'
    }
})
class PayButton extends Component {
    render() {
        const { classes, onClick, buttonText } = this.props;

        return (<Button
            className={classes.button}
            variant="contained"
            size='large'
            color='primary'
            onClick={onClick}>
            <img alt="Aion Logo" src={AionLogoLight} className={classNames(classes.leftIcon, classes.iconSmall)} />
            <b>{typeof (buttonText) !== 'undefined' && buttonText !== null ? buttonText : 'Aion Pay'}</b>
        </Button>)
    }
}

PayButton.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(PayButton);