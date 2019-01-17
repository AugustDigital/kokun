import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import UserTool from './UserTool'

class AionPayDialog extends React.Component {
  state = {
    dialogData:this.props.dialogData,
    currentStep: 0,
    totalSteps: 0
  };

  handleClose = () => {
    this.setState({ dialogData: null });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.dialogData !== nextProps.dialogData) {
      this.setState({
        dialogData: nextProps.dialogData
      });
    }
  }

  onStepChanged = (current, total) => {
    this.setState({
        currentStep: current,
        totalSteps: total
    })
}

  render() {
    const { fullScreen } = this.props;
    const {dialogData} = this.state;
    console.log(dialogData)
    return (
      <Dialog
          fullScreen={fullScreen}
          open={dialogData!=null}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogContent>
            <UserTool
              onStepChanged={this.onStepChanged}/>
          </DialogContent>
          
        </Dialog>
    );
  }
}

AionPayDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(AionPayDialog);
