import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types';
import AionPayDialog from './AionPayDialog'
import PayButton from './PayButton'
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { WidgetTheme } from '../themes/AppTheme';
import 'typeface-lato';
import cloneDeep from 'lodash.clonedeep';
import { version } from '../../package.json'

const styles = theme => ({

})
class AionPayButton extends Component {
    state = {
        dialogData: null
    }
    componentDidMount() { 
        if(this.props.toggleOpen){
            this.onPayButtonClick();
        }
    }
    onPayButtonClick = () => {
        this.setState({
            dialogData: {
                web3Provider: this.props.web3Provider,
                defaultRecipient: this.props.address,
                defaultSender: this.props.fromAddress,
                defaultAmount: this.props.amount,
                defaultTokenAddress: this.props.tokenAddress,
                transaction: this.props.transaction,
                callback: this.props.callback,
                toggleOpen: this.props.toggleOpen,
                skipConfirmation: this.props.skipConfirmation,
            }
        })
    }
    render() {
        const { dialogData } = this.state;
        const { buttonText, theme, buttonIconType } = this.props;

        return (<MuiThemeProvider theme={theme}>
            <CssBaseline>
                <div>
                    <PayButton
                        onClick={this.onPayButtonClick}
                        buttonText={buttonText}
                        buttonIconType={buttonIconType} />
                    <AionPayDialog
                        dialogData={dialogData} />
                </div>
            </CssBaseline>
        </MuiThemeProvider>)
    }
}

AionPayButton.propTypes = {
    classes: PropTypes.object.isRequired,
};


export const inject = () => {
    window.AionPayButtonInterface = {
        renderAionPayButton: inject,
        aionPayWidgetThemes: []
    }
    //Register our custom element
    document.createElement('aion-pay');
    // Find all DOM containers, and render buttons into them.
    document.querySelectorAll('aion-pay')
        .forEach(domContainer => {
            let address = domContainer.dataset.address;
            let fromAddress = domContainer.dataset.from;
            let amount = domContainer.dataset.amount;
            let tokenAddress = domContainer.dataset.tokenAddress;
            let buttonText = domContainer.dataset.buttonText;
            let buttonBackground = domContainer.dataset.buttonBackground;
            let buttonTextColor = domContainer.dataset.buttonTextColor;
            let buttonIconType = domContainer.dataset.buttonIconType;
            let buttonFontWeight = domContainer.dataset.buttonFontWeight;
            let buttonFontSize = domContainer.dataset.buttonFontSize;
            let buttonPaddingLeft = domContainer.dataset.buttonPaddingLeft;
            let buttonPaddingRight = domContainer.dataset.buttonPaddingRight;
            let buttonPaddingTop = domContainer.dataset.buttonPaddingTop;
            let buttonPaddingBottom = domContainer.dataset.buttonPaddingBottom;
            let style = domContainer.dataset.style;
            let web3Provider = domContainer.dataset.web3Provider;
            let transactionString = domContainer.dataset.transaction;
            let toggleOpen = domContainer.dataset.toggleOpen;
            let skipConfirmation = domContainer.dataset.skipConfirmation;
            let transaction;
            if (transactionString) {
                transaction = JSON.parse(transactionString)
            }

            let callback = (txHash, status) => {
                console.log('got callback data...')
                domContainer.dispatchEvent(new CustomEvent('transactionSent', {
                    detail: {
                        txHash: txHash,
                        status: status
                    }
                }));
            }

            let theme = cloneDeep(WidgetTheme);
            if (buttonBackground) {
                theme.palette.aionPay.backgroundColor = buttonBackground;
            }
            if (buttonTextColor) {
                theme.palette.aionPay.textColor = buttonTextColor;
            }
            if (buttonFontWeight) {
                theme.palette.aionPay.fontWeight = buttonFontWeight;
            }
            if (buttonFontSize) {
                theme.palette.aionPay.fontSize = buttonFontSize;
            }
            if (buttonPaddingTop) {
                theme.palette.aionPay.paddingTop = buttonPaddingTop;
            }
            if (buttonPaddingBottom) {
                theme.palette.aionPay.paddingBottom = buttonPaddingBottom;
            }
            if (buttonPaddingLeft) {
                theme.palette.aionPay.paddingLeft = buttonPaddingLeft;
            }
            if (buttonPaddingRight) {
                theme.palette.aionPay.paddingRight = buttonPaddingRight;
            }

            if (style) {
                let customPalette = JSON.parse(style);
                let themePallete = Object.assign({}, theme.palette, customPalette);
                theme.palette = themePallete;
            }
            window.AionPayButtonInterface.aionPayWidgetThemes.push(theme)
            let propData = { address, fromAddress, amount, tokenAddress, buttonText, web3Provider, theme, buttonIconType, transaction, callback, toggleOpen, skipConfirmation }

            ReactDOM.render(
                React.createElement(withStyles(styles)(AionPayButton), propData),
                domContainer
            );
        });
}

console.log('*************************************')
console.log(`*   AionPayButton VERSION :${version}    *`)
console.log('*************************************')

inject();

export default withStyles(styles)(AionPayButton);
