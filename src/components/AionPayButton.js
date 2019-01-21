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

const styles = theme => ({

})
class AionPayButton extends Component {
    state = { dialogData: null }
    componentDidMount() { }
    onPayButtonClick = () => {
        this.setState({
            dialogData: { field: 'todo' }
        })
    }
    render() {
        const { dialogData } = this.state;
        return (<MuiThemeProvider theme={WidgetTheme}>
            <CssBaseline>
                <div>
                    <PayButton
                        onClick={this.onPayButtonClick} />
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
            const propData = { address, buttonText, buttonBackground, style }
            console.log('aion-pay button parameters:')
            console.log(propData);

            ReactDOM.render(
                React.createElement(withStyles(styles)(AionPayButton), propData),
                domContainer
            );
        });
}

inject();

export default withStyles(styles)(AionPayButton);
