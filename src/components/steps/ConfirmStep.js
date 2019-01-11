import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, TextField, Grid, Button, Paper } from '@material-ui/core'


const styles = theme => ({
    paper:{
        backgroundColor:'white'
    }
})
class ConfirmStep extends Component {
    
    
    constructor(props){
        super(props);
        this.state = {
        }
        
    }
    
    componentDidMount() { }
    
    render() {
        const { classes } = this.props;
        const { expanded, completed } = this.state;

        console.log(this.props)
        
        return (
            <Grid spacing={8}
                container
                direction="column"
                justify="flex-start">
                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '25px'}}>Confirm Transaction</Typography>
                    <Paper className={classes.paper}>
                        todo
                    </Paper>
                </Grid>
        );
    }
}

ConfirmStep.propTypes = {
    classes: PropTypes.object.isRequired,
    onTransactonStepContinue: PropTypes.func.isRequired,
    onTransactonStepBack:PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired, to: PropTypes.string.isRequired, 
    amount: PropTypes.number.isRequired, 
    nrg: PropTypes.number.isRequired, 
    nrgPrice: PropTypes.number.isRequired
};

export default withStyles(styles)(ConfirmStep);
