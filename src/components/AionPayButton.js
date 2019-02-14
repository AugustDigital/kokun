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
    componentDidMount() { }
    onPayButtonClick = () => {
        this.setState({
            dialogData: {
                web3Provider: this.props.web3Provider,
                defaultRecipient: this.props.address,
                transaction: this.props.transaction,
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
        aionPayButtonCompletionListener: null,
        aionPayWidgetThemes: []
    }
    //Register our custom element
    document.createElement('aion-pay');
    // Find all DOM containers, and render buttons into them.
    document.querySelectorAll('aion-pay')
        .forEach(domContainer => {
            let address = domContainer.dataset.address;
            let buttonText = domContainer.dataset.buttonText;
            let buttonBackground = domContainer.dataset.buttonBackground;
            let buttonTextColor = domContainer.dataset.buttonTextColor;
            let buttonIconType = domContainer.dataset.buttonIconType;
            let style = domContainer.dataset.style;
            let web3Provider = domContainer.dataset.web3Provider;
            let transactionString = domContainer.dataset.transaction;
            let transaction;
            if (transactionString) {
                transaction = JSON.parse(transactionString)
            }


            let theme = cloneDeep(WidgetTheme);
            if (buttonBackground) {
                theme.palette.background.aionPay = buttonBackground;
            }
            if (buttonTextColor) {
                theme.palette.text.aionPay = buttonTextColor;
            }

            if (style) {
                let customPalette = JSON.parse(style);
                let themePallete = Object.assign({}, theme.palette, customPalette);
                theme.palette = themePallete;
            }
            window.AionPayButtonInterface.aionPayWidgetThemes.push(theme)
            let propData = { address, buttonText, web3Provider, theme, buttonIconType, transaction }

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
