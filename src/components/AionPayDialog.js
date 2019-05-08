import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'recompose/compose';
import { withStyles, Grid, Dialog, DialogTitle, DialogContent, withMobileDialog, IconButton, Typography, LinearProgress } from '@material-ui/core';
import UserTool from './UserTool'
import CloseIcon from '@material-ui/icons/Close';
import AionPayLogoLight from '../assets/aion_pay_logo_light.svg'
import PaperPlane from '../assets/paperplane.svg'

const styles = theme => ({
  progressBar: {
    backgroundColor: 'transparent',
    marginLeft: '-' + theme.spacing.unit * 3 + 'px',
    marginRight: '-' + theme.spacing.unit * 3 + 'px',
    height: '6px'
  },
  progressBarBar: {
    backgroundColor: theme.palette.common.green
  },
  stepText: {
    color: theme.palette.text.primaryLight
  }
})

const WhiteDialogContent = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.white
  },
}))(DialogContent);

const BlueDialogTitle = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 4,
    background: theme.palette.background.blueGradient,
    position: 'relative',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.white,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    width: '25px',
    height: '25px',
  },
  iconHeading: {
    float: 'left'
  },
  aionPayIcon:{
    height:'28px'
  },
  planeIcon: {
    position: 'absolute',
    marginRight: '50px',
    right: 0,
    width: '100px'
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <DialogTitle disableTypography className={classes.root}>
      <img alt='Plaine Icon' className={classes.planeIcon} src={PaperPlane} />
      <Grid spacing={24}
        container
        wrap="wrap"
        direction="row"
        alignItems="center"
        justify='space-between'>
        <Grid item >
          <img alt="Aion Pay Logo" className={classNames(classes.aionPayIcon)} src={AionPayLogoLight} />
        </Grid>
        <Grid item xs>
          <Typography color='textSecondary' variant="subtitle2" style={{ fontWeight: 'light', marginRight: '55px' }}>{children}</Typography>
        </Grid>
        <Grid item >
          {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Grid>

      </Grid>

    </DialogTitle>
  );
});

class AionPayDialog extends React.Component {
  state = {
    dialogData: this.props.dialogData,
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
    const { fullScreen, classes } = this.props;
    const { dialogData, currentStep, totalSteps } = this.state;
    let dialogContent;
    if (dialogData) {
      dialogContent = <UserTool
        style={{ marginTop: '25px' }}
        onStepChanged={this.onStepChanged}
        web3Provider={dialogData.web3Provider}
        defaultRecipient={dialogData.defaultRecipient}
        defaultAmount={dialogData.defaultAmount}
        defaultTokenAddress={dialogData.defaultTokenAddress}
        externalTransaction={dialogData.transaction}
        callback={dialogData.callback} />;
    }
    return (
      <Dialog
        fullScreen={fullScreen}
        open={dialogData != null}
        onClose={this.handleClose}
        fullWidth={true}
        maxWidth={fullScreen ? false : 'sm'}
        aria-labelledby="responsive-dialog-title">
        <BlueDialogTitle onClose={this.handleClose}>
        Seamlessly send Aion to any address
          </BlueDialogTitle>
        <WhiteDialogContent>
          <LinearProgress className={classes.progressBar} variant="determinate" value={currentStep / (totalSteps ) * 100} classes={{ bar: classes.progressBarBar }} />
          <Typography variant="subtitle1" className={classes.stepText} style={{ fontWeight: '300', marginTop: '25px' }}>Step {currentStep+1}/{totalSteps+1}</Typography>
          {dialogContent ? dialogContent : <div>
            Please check the Aion-Pay button parameters.
          </div>}
        </WhiteDialogContent>
      </Dialog>
    );
  }
}

AionPayDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles, { name: 'AionPayDialog' }),
  withMobileDialog()
)(AionPayDialog);
