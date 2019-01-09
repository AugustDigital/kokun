import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, AppBar, Toolbar, Button } from '@material-ui/core'
const styles = theme => ({
  appBar:{
    paddingLeft:theme.spacing.unit * 15,
    paddingRight:theme.spacing.unit * 15,
  },
  grow: {
    flexGrow: 1,
  },
})
class TopBar extends Component {

  state = {}

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    return (
        <AppBar position="static" color="primary">
            <Toolbar  className={classes.appBar}>
            <Typography variant="h6" color="inherit">
                AION CONNECT
            </Typography>
            <div className={classes.grow} />
            <div>
                <Button color="secondary" className={classes.button}>
                Help &amp; Support
                </Button>
            </div>
            </Toolbar>
        </AppBar>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
