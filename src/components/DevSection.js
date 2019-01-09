import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardContent } from '@material-ui/core'

const styles = theme => ({
    card: {
        backgroundColor: '#ffffff'
    }
})
class DevSection extends Component {

    state = {}

    componentDidMount() { }

    render() {
        const { classes } = this.props;
        return (
            <div className={this.props.className}>
                <Card className={classes.card}>
                    <CardContent>
                        <div>Dev Section</div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

DevSection.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DevSection);
