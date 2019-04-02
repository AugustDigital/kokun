import React from 'react';
import { withStyles, withMobileDialog, Dialog, TextField, Typography, DialogContent, Grid, Button, CircularProgress } from '@material-ui/core'
import { CheckCircleRounded } from '@material-ui/icons';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton'
const styles = theme => ({
  root: {
    background: theme.palette.background.blueGradient,
  },
  textFieldInput: {
    color: 'white !important'
  },
  textField: {
    color: 'white !important',
  },
  underline: {
    '&:before': {
      borderBottom: '2px solid #D8D8D8',
    },
    '&:after': {
      borderBottom: `2px solid #D8D8D8`
    }
  },
  closeButton: {
    textAlign: 'right',
    color: 'white !important',
  },
  headingFull: {
    fontWeight: '600',
    width: '100%',
    color: 'white !important',
  },
  heading: {
    fontWeight: '600',
    color: 'white !important',
  },
  addButton: {
    marginTop: theme.spacing.unit * 4,
    color: 'white !important',
    borderColor: 'white !important',
  },
  error: {
    color: theme.palette.common.link,
    width: '100%',
  },
  checkIcon: {
    fontSize: 84,
    color: theme.palette.common.green
  },
  marginTop: {
    marginTop: '24px',
  },
  successMsg: {
    marginTop: '24px',
    maxWidth: '220px',
    textAlign: 'center',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.common.green,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})
const BlueDialogContent = withStyles(theme => ({
  root: {
    background: theme.palette.background.blueGradient,
    paddingRight: theme.spacing.unit * 8 + 'px !important',
    paddingLeft: theme.spacing.unit * 8 + 'px !important',
    paddingTop: theme.spacing.unit * 4 + 'px !important',
    paddingBottom: theme.spacing.unit * 4 + 'px !important',
  },
}))(DialogContent);
class AddTokenDialog extends React.Component {
  state = {
    loading: false
  }
  onAddClick = async () => {
    if (this.state.address && this.state.address.length > 0) {
      this.setState({ loading: true })
      await this.props.onTockenAddressEntered(this.state.address)
      this.setState({
        address: '',
        loading: false
      })
      setTimeout(() => {
        this.setState({ finished: false, })
      }, 2000)
    }
  }
  onTockenAddressEntered = (event) => {
    this.setState(
      { address: event.target.value }
    )
  }
  onClose = () => {
    this.setState({
      loading: false
    })
    this.props.onClose();
  }
  render() {
    const { classes, open, fullScreen, error, addTokenSuccesfull } = this.props;
    const { loading } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={fullScreen ? false : 'sm'}
        aria-labelledby="simple-dialog-title"
        open={open}
        transitionDuration={{ exit: 1000 }}
        onClose={this.onClose}>
        <BlueDialogContent>
          {addTokenSuccesfull ?
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
            >
              <CheckCircleRounded className={classes.checkIcon} />
              <Typography variant="h5" className={classes.heading + ' ' + classes.marginTop}>Succesfully Added!</Typography>
              <Typography variant="caption" className={classes.successMsg}>The token address has been succesfully added to your currency list.</Typography>
            </Grid>
            :
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-end"
            >
              <Button color="secondary" onClick={this.onClose} className={classes.closeButton}>
                Close
          </Button>
              <Typography variant="h5" className={classes.headingFull}>Add Currency</Typography>
              <TextField
                fullWidth
                label="Enter Token Address"
                className={classes.textField}
                margin="normal"
                color="primary"
                onChange={this.onTockenAddressEntered}
                InputLabelProps={{
                  className: classes.textField,
                }}
                InputProps={{
                  classes: {
                    input: classes.textFieldInput,
                    underline: classes.underline
                  },
                }} />
              {error ?
                <Typography variant="caption" className={classes.error}>
                  {error}
                </Typography>
                : null}
              <div className={classes.wrapper}>

                <SecondaryButton
                  className={classes.addButton}
                  onClick={this.onAddClick}
                  disabled={loading}
                  text='ADD' />
                {loading && !error && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>


            </Grid>
          }


        </BlueDialogContent>
      </Dialog>)
  }
}

AddTokenDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onTockenAddressEntered: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles, { name: 'AddTokenDialog' }),
  withMobileDialog()
)(AddTokenDialog);