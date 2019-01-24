import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Grid, Button } from '@material-ui/core'
import AionLogoDark from '../assets/aion_logo_dark.svg'
import AugustLogoLight from  '../assets/august_logo_light.svg'

const styles = theme => ({
    root: {
        backgroundImage: 'linear-gradient(rgb(12,30,60) 50%, rgb(15,39,82) 50%)',
    },
    appBar: {
        paddingLeft: theme.spacing.unit * 15,
        paddingRight: theme.spacing.unit * 15,
    },
    grow: {
        flexGrow: 1,
    },
    topSection: {
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 3,
    },
    bottomSection: {
        width: '100%',
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 3,
        [theme.breakpoints.down('xs')]: {
            paddingBottom: theme.spacing.unit * 5,
        }
    },
    continueButton: {
        marginTop: theme.spacing.unit
    },
    donateSection: {
        textAlign: 'right',
        [theme.breakpoints.down('xs')]: {
            textAlign:'center',
            marginTop:theme.spacing.unit*2
        }
    },
    infoSection:{
        textAlign: 'left',
        [theme.breakpoints.down('xs')]: {
            textAlign:'center',
        }
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    iconMedium: {
        width: '60px',
        height: '60px',
        [theme.breakpoints.down('xs')]: {
            width: '70px',
            height: '70px',
        }
    },
    infoText:{
        fontSize:'1.25em',
        [theme.breakpoints.down('xs')]: {
            fontSize:'0.75em'
        }
    }
})
class BottomBar extends Component {

    state = {}

    componentDidMount() { }
    onDonateClick = () => {
        console.log('todo')
        //todo use : 0xa0c14dfdd475dcf305c00299e7d7ca5cacb97633385952d2024a365a1b1ddfa3
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(this.props.className, classes.root)}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Grid
                        className={classes.topSection}
                        container
                        wrap="wrap"
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        <Grid item xs={12} sm={6} className={classes.infoSection}>
                            <Typography variant="h6" className={classes.infoText} style={{ fontWeight: 'bold' }}>August is committed to developing more tools and dApps to support and grow the Aion ecosystem</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.donateSection}>
                            <div >
                                <Typography variant="h6" style={{ fontWeight: '400' }}>Support us and donate</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size='large'
                                    onClick={this.onDonateClick}//.bind(this)
                                    className={classes.continueButton}>
                                    <img alt="Aion Logo" className={classNames(classes.leftIcon, classes.iconSmall)} src={AionLogoDark} />
                                    <b>Donate</b>
                                </Button>
                            </div>
                        </Grid>

                    </Grid>
                    <div className={classes.bottomSection}>
                        <a target='_blank' rel='noopener noreferrer' href='https://alwaysaugust.co/'>
                            <img alt="August Logo" className={classNames(classes.leftIcon, classes.iconMedium)} src={AugustLogoLight} />
                        </a>
                    </div>
                </Grid>
            </div>
        );
    }
}

BottomBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomBar);
