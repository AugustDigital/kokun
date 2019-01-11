import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography } from '@material-ui/core'
import UserTool from './UserTool'

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundImage: 'linear-gradient(to right, rgba(28,116,147,1), rgba(13,25,70,1));',
    },
    left: {
        paddingRight: theme.spacing.unit * 6
    },
    center: {
        borderLeft: '1px solid rgba(255,255,255,0.2)',
        height: '500px'
    },
    right: {
        paddingLeft: theme.spacing.unit * 6
    },
    infoContainer: {
        //maxWidth:'280px',
        marginLeft: 'auto',
        //marginRight:'auto'
    },
    toolContainer: {
        //maxWidth:'90%',
        marginLeft: 'auto',
        //marginRight:'auto'
    }
})
class UserSection extends Component {

    state = {}

    componentDidMount() { }

    render() {
        const { classes } = this.props;
        console.log(this.props.className)
        return (
            <div className={this.props.className + ' ' + classes.root}>
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
                    <Grid item>
                        <div className={classes.center} />
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.right}>
                            <div className={classes.toolContainer}>
                                <UserTool />
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
