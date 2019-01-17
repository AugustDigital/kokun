import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AionLogoLarge from '../assets/aion_logo_large.png'

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
})
class PayButton extends Component{
    render(){
        const {classes, onClick} = this.props;
        
        return(<Button
            variant="contained"
            color="primary"
            size='large'
            onClick={onClick}>
            <img alt="Cranberry Logo" src={AionLogoLarge} className={classNames(classes.leftIcon, 'rotation', classes.iconSmall)} />
            <b>Aion Pay</b>
        </Button>)
    }
}

PayButton.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PayButton);