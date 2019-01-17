import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types';
import AionPayDialog from './AionPayDialog'
import PayButton from './PayButton'
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppTheme from '../themes/AppTheme';
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
        const { classes } = this.props;
        const { dialogData } = this.state;
        return (<MuiThemeProvider theme={AppTheme}>
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

// Find all DOM containers, and render buttons into them.
document.querySelectorAll('.aion_pay_button_container')
    .forEach(domContainer => {
        const someParams = parseInt(domContainer.dataset.todoproperty, 10); //prams are lower case
        console.log(someParams);
        ReactDOM.render(
            React.createElement(withStyles(styles)(AionPayButton), { someParams: someParams }),
            domContainer
        );
    });

export default withStyles(styles)(AionPayButton);