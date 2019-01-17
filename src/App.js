import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core'
import TopBar from './components/TopBar.js'
import UserSection from './components/UserSection'
import DevSection from './components/DevSection'
import BottomBar from './components/BottomBar'
import Animations from './Animations.css'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  userSection: {
    paddingRight: '10%',
    paddingLeft: '10%',
    paddingBottom: theme.spacing.unit * 5,
  },
  devSection: {
  },
  devSectionContainer: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.07));',
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'content-box',
    paddingRight: '16%',
    paddingLeft: '16%',
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 12,
  },
  bottomBar: {
    paddingRight: '16%',
    paddingLeft: '16%',
  },
  grow: {
    flexGrow: 1,
  },
})
class App extends Component {

  state = {}

  componentDidMount() { }

  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <TopBar />
        <UserSection className={classes.userSection} />
        <div className={classes.devSectionContainer}>
          <DevSection className={classes.devSection} />
        </div>
        <BottomBar className={classes.bottomBar} />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
