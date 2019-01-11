import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core'
import WalletProvidersStep from './steps/WalletProvidersStep'
import SendStep from './steps/SendStep'
import ConfirmStep from './steps/ConfirmStep'
const styles = theme => ({

})
class UserTool extends Component {

    state = {
        step: 1//todo switch back to 0 after testing
    }

    componentDidMount() { }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
            transactionData:null
        });
    };
    onAccountImported = (account) => {
        this.setState({
            account: account,
            step: 1
        })
    }
    onSendStepContinue = (currency, from, to, amount, nrg, nrgPrice) => {
        this.setState({
            step: 2,
            transactionData:{currency, from, to, amount, nrg, nrgPrice}
        })
        //todo pass transaction data to next step
    }
    onSendStepBack = () => {
        this.setState({
            step: 0
        })
    }

    onTransactionStepContinue = () => {
        this.setState({
            step: 0
        })
    }
    onTransactionStepBack = () => {
        this.setState({
            step: 1
        })
    }
    render() {
        const { classes } = this.props;
        const { step, transactionData } = this.state;
        let content = null;
        switch (step) {
            case 0: { // Account import
                content = (<WalletProvidersStep
                    onAccountImported={this.onAccountImported}
                />);
                break;
            }
            case 1: { // Send 
                content = (<SendStep
                    onSendStepContinue={this.onSendStepContinue}
                    onSendStepBack={this.onSendStepBack}
                />);
                break;
            }
            case 2: { // Confirm
                content = (<ConfirmStep
                    onTransactonStepContinue={this.onTransactionStepContinue}
                    onTransactonStepBack={this.onTransactionStepBack}
                    currency= {transactionData.currency}
                    from= {transactionData.from}
                    to={transactionData.to}
                    amount= {transactionData.amount}
                    nrg= {transactionData.nrg}
                    nrgPrice= {transactionData.nrgPrice}
                />);
                break;
            }
            default: {
                content = (null);
            }
        }

        return (
            content
        );
    }
}

UserTool.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserTool);
