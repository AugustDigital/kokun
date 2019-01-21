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

const styles = theme => ({

})
class AionPayButton extends Component {
    state = {
        dialogData: null
    }
    componentDidMount() { }
    onPayButtonClick = () => {
        this.setState({
            dialogData: { web3Provider: this.props.web3Provider,
            defaultRecipient: this.props.address }
        })
    }
    render() {
        const { dialogData } = this.state;
        const { buttonText, theme } = this.props;


        return (<MuiThemeProvider theme={theme}>
            <CssBaseline>
                <div>
                    <PayButton
                        onClick={this.onPayButtonClick}
                        buttonText={buttonText}/>
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
    console.log('...injecting aion-pay buttons')
    //Register our custom element
    document.createElement('aion-pay');

    // Find all DOM containers, and render buttons into them.
    document.querySelectorAll('aion-pay')
        .forEach(domContainer => {
            const address = domContainer.dataset.address;
            const buttonText = domContainer.dataset.buttonText;
            const buttonBackground = domContainer.dataset.buttonBackground;
            const style = domContainer.dataset.style;
            const web3Provider = domContainer.dataset.web3Provider


            let theme =  cloneDeep(WidgetTheme);
            if(buttonBackground){
                theme.palette.background.aionPay = buttonBackground;
                console.log(buttonBackground)
            }

            //todo parse style

            const propData = { address, buttonText, web3Provider, theme }

            console.log(propData);

            ReactDOM.render(
                React.createElement(withStyles(styles)(AionPayButton), propData),
                domContainer
            );
        });
}

inject();

export default withStyles(styles)(AionPayButton);
