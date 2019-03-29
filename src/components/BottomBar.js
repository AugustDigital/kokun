import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Grid } from '@material-ui/core'
import AugustLogoLight from  '../assets/august_logo_light.svg'
import { defaultProvider, developmentProvider } from '../../global_config'
import queryString from 'stringquery'

const PAGE_PADDING ='15%'
const styles = theme => ({
    root: {
    },
    grow: {
        flexGrow: 1,
    },
    topSection: {
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 3,
        paddingLeft: PAGE_PADDING,
        paddingRight: PAGE_PADDING,
    },
    bottomSection: {
        width: '100%',
        textAlign: 'center',
        paddingLeft: PAGE_PADDING,
        paddingRight: PAGE_PADDING,
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 3,
        backgroundColor:'rgb(15,39,82)',
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
        fontSize:'1.0em',
        color:theme.palette.text.secondary,
        fontWeight:'400',
        textAlign: 'center',
        marginBottom: theme.spacing.unit*4,
        [theme.breakpoints.down('xs')]: {
            fontSize:'0.75em'
        }
    },
    donateButton:{
        marginBottom: theme.spacing.unit*6,
    }
})
class BottomBar extends Component {

    state = {
        Provider: defaultProvider
    }

    componentWillMount() {
        const queryParams = queryString(window.location.search);
        if (queryParams.testnet === 'true') {
            this.setState({ Provider: developmentProvider })
        } else {
            this.setState({ Provider: defaultProvider })
        }
    }

    render() {
        const { classes } = this.props;
        const { Provider } = this.state;
        return (
            <div className={classNames(this.props.className)}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Grid item xs={12} sm={6} className={classes.infoSection}>
                            <Typography variant="h6" className={classes.infoText} >We are commited to developing more tools and dApps to support and grow the Aion ecosystem. Support us and donate</Typography>
                        </Grid>
                        <div className={classes.donateButton}>
                            <aion-pay
                                data-button-text= 'Donate'
                                data-button-background='#FFFFFF'
                                data-button-text-color='#113665'
                                data-button-font-weight='550'
                                data-button-font-size='14px'
                                data-button-icon-type='dark'
                                data-button-padding-top='10px'
                                data-button-padding-bottom='10px'
                                data-button-padding-left='24px'
                                data-button-padding-right='24px'
                                data-address='0xa0c14dfdd475dcf305c00299e7d7ca5cacb97633385952d2024a365a1b1ddfa3'
                                data-web3-provider={Provider}/>
                        </div>
                        
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
