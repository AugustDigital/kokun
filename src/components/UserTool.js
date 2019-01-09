import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Button } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning';
const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.primary.main,
        // paddingTop: '14px',
        // paddingBottom: '14px',
        flexShrink: 0,
    },
    headingExpanded: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.primary.main,
        paddingTop: '0px',
        paddingBottom: '0px'
    },
    content:{
        width:'100%'
    },
    normalPanelStyle:{
        background: '#ffffff',
    },
    expandedPanelStyle:{
        background: '#ffffff',
        borderStyle:'solid',
        borderWidth:'3px',
        borderRadius:'5px',
        borderColor:'rgb(75,229,167)'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
    },
    textField: {
        marginTop:'0px',
        marginBottom:'0px'
    },
    privateKeyWarning:{
        width:'fit-content',
        backgroundColor:"rgb(224,125,8)",
        marginTop:theme.spacing.unit,
        paddingRight:theme.spacing.unit,
        paddingLeft:theme.spacing.unit,
        paddingTop:'2px',
        paddingBottom:'2px'
    },
    warningIcon:{
        marginRight: theme.spacing.unit,
        fontSize: 12,
        color:"#fff"
    }
})
class UserTool extends Component {

    state = {
        expanded: null,
    }

    componentDidMount() { }
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        return (
            <Grid container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
            <ExpansionPanel className={expanded?classes.expandedPanelStyle:classes.normalPanelStyle} expanded={expanded === 'panelPrivateKey'} onChange={this.handlePanelChange('panelPrivateKey')}>
                <ExpansionPanelSummary>
                    <Typography className={expanded?classes.headingExpanded:classes.heading}>PRIVATE KEY</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.content}>
                    <TextField
                        fullWidth
                        id="standard-uncontrolled"
                        label="Enter Private Key"
                        className={classes.textField}
                        margin="normal"
                    />
                    <br/>
                    <Grid className={classes.privateKeyWarning}
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center">
                        <Grid item>
                            <Warning className={classes.warningIcon}/>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">Using a private key online is not safe</Typography>
                        </Grid>
                    </Grid>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </Grid>
            <Grid>
                <Button variant="contained" color="#ff00ff">Continue</Button>
            </Grid>
            </Grid>
        );
    }
}

UserTool.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserTool);
