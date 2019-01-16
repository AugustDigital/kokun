import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, LinearProgress } from '@material-ui/core'
import classNames from 'classnames';
import UserTool from './UserTool'

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundImage: 'linear-gradient(to right, rgba(28,116,147,1), rgba(13,25,70,1));',
    },
    left: {
        paddingRight: theme.spacing.unit * 8
    },
    right: {
    },
    infoContainer: {
        marginLeft: 'auto',
    },
    toolContainer: {
        marginLeft: 'auto',
        paddingLeft: theme.spacing.unit * 10,
        marginTop: theme.spacing.unit * 8,

        borderLeft: '1px solid rgba(255,255,255,0.2)',
    },
    progressBar: {
        marginLeft: theme.spacing.unit * 10,
        backgroundColor: 'transparent'
    },
    progressBarBar: {
        backgroundColor: 'rgb(80,241,175)'
    },
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
                    <Grid item xs={4}>
                        <div className={classes.left}>
                            <div className={classes.infoContainer}>
                                <Typography variant="h4" style={{ fontWeight: 300 }}> Connect With the Aion network</Typography>
                                <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '25px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet.</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.right}>
                            <LinearProgress className={classes.progressBar} variant="determinate" value={currentStep / (totalSteps - 1) * 100} classes={{ bar: classes.progressBarBar }} />
                            <div className={classes.toolContainer}>
                                {currentStep > 0 ?
                                    <Typography variant="subtitle1" style={{ fontWeight: '300', marginBottom: '15px' }}>Step {currentStep}/{totalSteps}</Typography>
                                    : null}

                                <UserTool
                                    onStepChanged={this.onStepChanged}
                                />
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
