import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AionLogoLight from '../assets/aion_logo_light.svg'
import AionLogoDark from '../assets/aion_logo_dark.svg'

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    button:{
        backgroundColor: theme.palette.aionPay.backgroundColor+' !important',
        fontSize: theme.palette.aionPay.fontSize+' !important',
        fontWeight: theme.palette.aionPay.fontWeight+' !important',
        paddingTop:theme.palette.aionPay.paddingTop,
        paddingBottom:theme.palette.aionPay.paddingBottom,
        paddingLeft:theme.palette.aionPay.paddingLeft,
        paddingRight:theme.palette.aionPay.paddingRight,
    },
    lable:{
        color:theme.palette.aionPay.textColor+' !important'
    }
})
class PayButton extends Component {
    render() {
        const { classes, onClick, buttonText, buttonIconType } = this.props;

        return (<Button
            className={classes.button}
            variant="contained"
            size='medium'
            color='primary'
            onClick={onClick}>
            <img alt="Aion Logo" src={buttonIconType==='dark'?AionLogoDark:AionLogoLight} className={classNames(classes.leftIcon, classes.iconSmall)} />
            <b className={classes.lable}>{typeof (buttonText) !== 'undefined' && buttonText !== null ? buttonText : 'Aion Pay'}</b>
        </Button>)
    }
}

PayButton.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(PayButton);