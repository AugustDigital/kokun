import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core'
import WalletProvidersStep from './WalletProvidersStep'
const styles = theme => ({

})
class UserTool extends Component {

    state = {
        expanded: null,
        step: 0
    }

    componentDidMount() { }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    onAccountImported = (account) => {
        this.setState({
            account: account,
            step: 1
        })
    }
    render() {
        const { classes } = this.props;
        const { expanded, step } = this.state;
        let content = null;
        switch (step) {
            case 0: { // Account import
                content = (<WalletProvidersStep
                    onAccountImported={this.onAccountImported}
                />);
                break;
            }
            case 1: { // Send 
                content = (<div>TODO: Send</div>);
                break;
            }
            case 2: { // Receipt
                content = (<div>TODO: Receipt...</div>);
                break;
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
