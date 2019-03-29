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
        backgroundColor: theme.palette.background.aionPay+' !important',
        fontSize: '11px'
    },
    lable:{
        color:theme.palette.text.aionPay+' !important'
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