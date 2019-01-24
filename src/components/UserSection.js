import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, LinearProgress } from '@material-ui/core'
import classNames from 'classnames';
import UserTool from './UserTool'
import Provider from '../../global_config'

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundImage: theme.palette.background.blueGradient,
    },
    left: {
        paddingRight: theme.spacing.unit * 8,
        [theme.breakpoints.down('xs')]: {
            paddingRight: theme.spacing.unit, 
            marginTop: theme.spacing.unit * 3,
        }
    },
    right: {
    },
    infoContainer: {
        marginLeft: 'auto',
    },
    toolContainer: {
        marginLeft: 'auto',
        paddingLeft: theme.spacing.unit * 10,
        marginTop: theme.spacing.unit * 6,
        borderLeft: '1px solid '+theme.palette.divider,
        [theme.breakpoints.down('xs')]: {
            borderLeft: '0px',
            borderTop: '1px solid '+theme.palette.divider,
            marginLeft: '0px',
            marginTop: '0px',
            paddingTop: theme.spacing.unit * 3,
            paddingLeft: '0px',
        }
        
    },
    progressBar: {
        marginLeft: theme.spacing.unit * 10,
        backgroundColor: 'transparent',
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0px',
            marginTop: theme.spacing.unit * 3,
        }
    },
    progressBarBar: {
        backgroundColor: theme.palette.common.green
    },
    stepText:{
      color:theme.palette.text.primaryLight
    }
})
class UserSection extends Component {

    state = {
        currentStep: 0,
        totalSteps: 0
    }

    componentDidMount() { }

    onStepChanged = (current, total) => {
        this.setState({
            currentStep: current,
            totalSteps: total
        })
    }

    render() {
        const { classes } = this.props;
        const { currentStep, totalSteps } = this.state;
        console.log(currentStep + "/" + totalSteps)
        return (
            <div className={classNames(this.props.className, classes.root)}>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <div className={classes.left}>
                            <div className={classes.infoContainer}>
                                <Typography variant="h4" style={{ fontWeight: 300 }}> Connect With the Aion network</Typography>
                                <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '25px' }}>Aion Connect aims to be your toolkit for the Aion Blockchain. We will continue to add new and valuable tools that make it easy to interact with the protocol.</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.right}>
                            <LinearProgress className={classes.progressBar} variant="determinate" value={currentStep / (totalSteps) * 100} classes={{ bar: classes.progressBarBar }} />
                            <div className={classes.toolContainer}>
                                {currentStep !== totalSteps && currentStep !== 0 ?
                                    <Typography variant="subtitle1" className={classes.stepText} style={{ fontWeight: '300', marginBottom: '15px' }}>Step {currentStep}/{totalSteps}</Typography>
                                    : null}

                                <UserTool
                                    showInfoHeader={true}
                                    onStepChanged={this.onStepChanged}
                                    web3Provider={Provider}/>

                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

UserSection.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserSection);
