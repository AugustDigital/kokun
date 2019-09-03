import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core'
import TopBar from './components/TopBar.js'
import UserSection from './components/UserSection'
import DevSection from './components/DevSection'
import BottomBar from './components/BottomBar'
import PaperPlane from './assets/paperplane.svg'

const PAGE_PADDING ='15%'
const PAGE_PADDING_MOBILE ='5%'
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  userSection: {
    paddingRight: PAGE_PADDING,
    paddingLeft: PAGE_PADDING,
    paddingBottom: theme.spacing.unit * 5,
    [theme.breakpoints.down('xs')]: {
      paddingRight: PAGE_PADDING_MOBILE,
      paddingLeft: PAGE_PADDING_MOBILE,
    }
  },
  devSection: {
  },
  devSectionContainer: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.07));',
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'content-box',
    paddingRight: PAGE_PADDING,
    paddingLeft: PAGE_PADDING,
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 6,
    [theme.breakpoints.down('xs')]: {
      paddingRight: PAGE_PADDING_MOBILE,
      paddingLeft: PAGE_PADDING_MOBILE,
    }
  },
  bottomBar: {
    paddingRight: PAGE_PADDING,
    paddingLeft: PAGE_PADDING,
  },
  grow: {
    flexGrow: 1,
  },
  planeIcon: {
    position:'absolute',
    marginTop:'240px',
    marginLeft:'-30px',
    width:'150px',
    [theme.breakpoints.down('xs')]: {
      display:'none'
    }
  }
})
class App extends Component {

  state = {}

  componentDidMount() { }

  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <TopBar />
        <img alt='Plaine Icon' className={classes.planeIcon} src={PaperPlane}/>
        <UserSection className={classes.userSection}/>
        <div className={classes.devSectionContainer}>
          <DevSection className={classes.devSection} />
        </div>
        <BottomBar/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
