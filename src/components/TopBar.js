import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, AppBar, Toolbar, Button, Grid } from '@material-ui/core'
const styles = theme => ({
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
    fontSize: 15
  }
})
class TopBar extends Component {

  state = {}

  componentDidMount() { }

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static" color="primary">
        <Toolbar className={classes.appBar}>
          <Grid container
            className={classes.appBarContent}
            direction="row"
            justify="space-between"
            alignItems="center">
            <Grid item xs={12} sm={6} className={classes.title}>
              <Typography variant="h6" color="inherit">
                AION CONNECT
            </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.helpButtonContainer}>
              <Button color="secondary" className={classes.helpButton}>
                Help &amp; Support
                </Button>
            </Grid>
          </Grid>


        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
