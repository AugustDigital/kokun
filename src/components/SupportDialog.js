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
    color: 'white !important'
  },
  textArea: {
      paddingLeft: '10px',
      backgroundColor: 'rgb(0, 77, 124)',
      color: 'white !important',
      borderRadius: '5px'
  },
  textAreaUnderline:{
      '&:before': {
        borderBottom: '1px solid rgb(0, 77, 124)'
      },
      '&:after': {
        borderBottom: '1px solid rgb(0, 77, 124)'
      },
      '&:hover':{
        borderBottom: '1px solid rgb(0, 77, 124) !important'
      }
  },
  underline: {
    '&:before': {
      borderBottom: '2px solid #D8D8D8'
    },
    '&:after': {
      borderBottom: `2px solid #D8D8D8`
    }
  },
  closeButton: {
    textAlign: 'right',
    color: 'white !important'
  },
  headingFull: {
    fontWeight: '600',
    width: '100%',
    color: 'white !important'
  },
  addButton: {
    marginTop: theme.spacing.unit * 4,
    color: 'white !important',
    borderColor: 'white !important',
    float: 'right'
  },
  error: {
    color: theme.palette.common.link,
    width: '100%'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
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
class SupportDialog extends React.Component {
  state = {
      name: '',
      email: '',
      subject: '',
      message: '',
      validForm: false
  }

  onNameEntered = (event) => {
    this.setState(
      { name: event.target.value }, this.validateInputs()
    )
  }
  onEmailEntered = (event) => {
    this.setState(
      { email: event.target.value }, this.validateInputs()
    )
  }
  onSubjectEntered = (event) => {
    this.setState(
      { subject: event.target.value }, this.validateInputs()
    )
  }
  onMessageEntered = (event) => {
    this.setState(
      { message: event.target.value }, this.validateInputs()
    )
  }

  validateInputs(){

      if(this.state.name && this.state.name.length > 0 &&
         this.state.email && this.state.email.length > 0 &&
         this.state.subject && this.state.subject.length > 0 &&
         this.state.message && this.state.message.length > 0){
             this.setState({validForm: true})
      }else{
          this.setState({validForm: false})
      }
  }
  onClose = () => {
    this.props.onClose();
  }
  render() {
    const { classes, open, fullScreen, error } = this.props;
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
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-end"
            >
              <Button color="secondary" onClick={this.onClose} className={classes.closeButton}>
                Close
              </Button>
              <Typography variant="h5" className={classes.headingFull}>Help & Support</Typography>
              <form action="https://formspree.io/kokun@alwaysaugust.co" method="post">
                  <TextField
                    fullWidth
                    label="Enter Full Name"
                    name="name"
                    className={classes.textField}
                    margin="normal"
                    color="primary"
                    onChange={this.onNameEntered}
                    InputLabelProps={{
                      className: classes.textField,
                    }}
                    InputProps={{
                      classes: {
                        input: classes.textFieldInput,
                        underline: classes.underline
                      },
                    }} />
                    <TextField
                      fullWidth
                      label="Enter Email Address"
                      name="email"
                      className={classes.textField}
                      margin="normal"
                      color="primary"
                      onChange={this.onEmailEntered}
                      InputLabelProps={{
                        className: classes.textField,
                      }}
                      InputProps={{
                        classes: {
                          input: classes.textFieldInput,
                          underline: classes.underline
                        },
                      }} />
                      <TextField
                        fullWidth
                        label="Enter Subject"
                        name="subject"
                        className={classes.textField}
                        margin="normal"
                        color="primary"
                        onChange={this.onSubjectEntered}
                        InputLabelProps={{
                          className: classes.textField,
                        }}
                        InputProps={{
                          classes: {
                            input: classes.textFieldInput,
                            underline: classes.underline
                          },
                        }} />
                        <TextField
                          fullWidth
                          multiline
                          rows="5"
                          label="Enter Message"
                          name="message"
                          className={classes.textArea}
                          margin="normal"
                          color="primary"
                          onChange={this.onMessageEntered}
                          InputLabelProps={{
                            className: classes.textArea,
                          }}
                          InputProps={{
                            classes: {
                              input: classes.textFieldInput,
                              underline: classes.textAreaUnderline
                            },
                          }} />
                  {error ?
                    <Typography variant="caption" className={classes.error}>
                      {error}
                    </Typography>
                    : null}
                  <div className={classes.wrapper} style={{color:'white'}}>
                    {this.state.validForm ?
                    <SecondaryButton
                      className={classes.addButton}
                      buttonType="submit"
                      text='SUBMIT' />
                      : "Please complete all fields"}
                  </div>
              </form>


            </Grid>


        </BlueDialogContent>
      </Dialog>)
  }
}

SupportDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles, { name: 'SupportDialog' }),
  withMobileDialog()
)(SupportDialog);
