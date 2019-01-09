import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core'
import TopBar from './components/TopBar.js'
import UserSection from './components/UserSection'
import DevSection from './components/DevSection'
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  userSection: {
    paddingRight: theme.spacing.unit * 30,
    paddingLeft: theme.spacing.unit * 30,
  },
  devSection: {
    marginRight: theme.spacing.unit * 30,
    marginLeft: theme.spacing.unit * 30,
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5,
  },
  devSectionContainer: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.07));',
    height:'100%'
  },
  grow: {
    flexGrow: 1,
  },
})
class App extends Component {

  state = {}

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <TopBar />
        <UserSection className={classes.userSection} />
        <div className={classes.devSectionContainer}>
          <DevSection className={classes.devSection} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
