import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, AppBar, Toolbar, Button, Grid, Dialog } from '@material-ui/core'
import KokunLogo from '../assets/kokun_logo.svg'
import SupportDialog from './SupportDialog'
const styles = theme => ({
  topBar:{
      backgroundColor:'transparent',
      boxShadow:'none'
  },
  appBar: {
    paddingLeft: theme.spacing.unit * 15,
    paddingRight: theme.spacing.unit * 15,
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing.unit ,
      paddingBottom: theme.spacing.unit ,
      paddingLeft: theme.spacing.unit * 10,
      paddingRight: theme.spacing.unit * 10,
    }
  },
  appBarContent: {
    flexGrow: 1,
  },
  title:{
    textAlign:'left',
    [theme.breakpoints.down('xs')]: {
      textAlign:'center',
    }
  },
  helpButtonContainer: {
    textAlign:'right',
    [theme.breakpoints.down('xs')]: {
      textAlign:'center',
    }
  },
  helpButton: {
    textTransform: 'none',
    fontSize: 14
  }
})
class TopBar extends Component {

  state = {
      supportDialogOpened: false
  }

  componentDidMount() { }

  onSupportClicked = () => {
        this.setState({supportDialogOpened: true})
  }

  onsupportDialogClosed = () => {
      this.setState({supportDialogOpened: false})
  }

  render() {
    const { classes } = this.props;
    const { supportDialogOpened } = this.state;
    return (
        <React.Fragment>
          <AppBar position="absolute" color="primary" className={classes.topBar}>
            <Toolbar className={classes.appBar}>
              <Grid container
                className={classes.appBarContent}
                direction="row"
                justify="space-between"
                alignItems="center">
                <Grid item xs={12} sm={6} className={classes.title}>
                <a href=".">
                  <img alt='Kokun Logo' src={KokunLogo} height='25px'></img>
                </a>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.helpButtonContainer}>
                  <Button color="secondary" onClick={this.onSupportClicked} className={classes.helpButton}>
                    Help &amp; Support
                    </Button>
                </Grid>
              </Grid>

            </Toolbar>
          </AppBar>
          <SupportDialog
              open={supportDialogOpened}
              onClose={this.onsupportDialogClosed}
          />
      </React.Fragment>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
