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
    },
    continueButton: {
        marginTop: theme.spacing.unit
    },
    donateSection: {
        textAlign: 'right'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    iconMedium: {
        width: '50px',
        height: '50px',
    }
})
class BottomBar extends Component {

    state = {}

    componentDidMount() { }
    onDonateClick = () => {
        console.log('todo')
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
                        <Grid item xs>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>August is committed to developing more tools and dApps to support and grow the Aion ecosystem</Typography>
                        </Grid>
                        <Grid item xs>
                            <div className={classes.donateSection}>
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
                        <img alt="August Logo" className={classNames(classes.leftIcon, classes.iconMedium)} src={AugustLogoLight} />
                        <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '15px' }}>Powered by <a target='_blank' rel='noopener noreferrer' href='https://alwaysaugust.co/'>August</a></Typography>
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
