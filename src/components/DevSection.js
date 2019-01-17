import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Button, Grid, Paper } from '@material-ui/core'
import AionLogoLarge from '../assets/aion_logo_large.png'
import AionPayDialog from './AionPayDialog'
import PayButton from './PayButton'

const styles = theme => ({
    card: {
        backgroundColor: '#ffffff',
        marginTop: theme.spacing.unit * 2,
        borderRadius: '6px'
    },
    cardHeading: {
        backgroundImage: 'linear-gradient(to right, rgba(28,116,147,1), rgba(13,25,70,1));',
        padding: theme.spacing.unit * 4,
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px'
    },
    githubButton: {
        textTransform: 'capitalize',
        marginRight: theme.spacing.unit * 4
    },
    githubButtonContainer: {
        textAlign: 'right'
    },
    snippet: {
        padding: theme.spacing.unit * 2,
        backgroundColor: 'rgb(239,244,249)',
        color: 'black',
        marginLeft: theme.spacing.unit * 2,
        borderRadius: '4px'
    },
    cardContent: {
        padding: theme.spacing.unit * 4,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        width: '25px',
        height: '25px',
    },
    iconHeading: {
        float: 'left'
    }
})
class DevSection extends Component {

    state = {
        dialogData: null
    }
    content = [
        { description: 'Pay to any address with default button style', onClick: this.onPayButtonClick, snippet: '<aion-pay></aion-pay' },
        { description: 'Pay to a given address with default button style', onClick: this.onPayButtonClick, snippet: '<aion-pay></aion-pay' },
        { description: 'Pay to a given address with custom text and background but with AION icon on the button.', onClick: this.onPayButtonClick, snippet: '<aion-pay></aion-pay' },
        { description: 'Pay to a given address with custom style.', onClick: this.onPayButtonClick, snippet: '<aion-pay></aion-pay' },
    ]
    componentDidMount() { }

    onGithubButtonPressed = () => {
        window.open('https://github.com/alwaysaugust');
    }

    onPayButtonClick = () => {
        this.setState({
            dialogData: { field: 'todo' }
        })
    }

    render() {
        const { classes } = this.props;
        const { dialogData } = this.state;
        console.log(dialogData)
        const contentItems = this.content.map((item, index) => {
            return <Grid key={index} item>
                <div style={{ marginTop: '30px' }}>
                    <Typography color='textSecondary' variant="h6" style={{ fontWeight: '400' }}>{index + 1}. {item.description}</Typography>
                    <Grid
                        container
                        style={{ marginTop: '15px' }}
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        <PayButton
                            onClick={this.onPayButtonClick} />
                        <Grid item xs>
                            <Typography variant="subtitle2" className={classes.snippet} style={{ fontWeight: 'light' }}> {item.snippet} </Typography>
                        </Grid>
                    </Grid>

                </div>

            </Grid>
        })
        return (
            <div className={this.props.className}>
                <Typography color='textSecondary' variant="h6" style={{ fontWeight: 'bold' }}>
                    <img alt="Cranberry Logo" className={classNames(classes.leftIcon, 'rotation', classes.iconSmall, classes.iconHeading)} src={AionLogoLarge} />
                    AION PAY
                </Typography>
                <Paper className={classes.card}>
                    <div>
                        <div className={classes.cardHeading}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                wrap="wrap">
                                <Grid item xs>
                                    <div>
                                        <Typography variant="h6" style={{ fontWeight: '400' }}>Connect with the Aion network</Typography>
                                        <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '15px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere diam quis risus fringilla, quis consectetur nunc imperdiet.</Typography>

                                    </div>
                                </Grid>

                                <Grid item xs
                                    className={classes.githubButtonContainer}>
                                    <Button
                                        className={classes.githubButton}
                                        variant="outlined"
                                        size='large'
                                        onClick={this.onGithubButtonPressed}>
                                        <b>GitHub</b>
                                    </Button>
                                </Grid>

                            </Grid>

                        </div>
                        <div className={classes.cardContent}>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                            > {contentItems}</Grid>
                        </div>
                    </div>
                </Paper>
                <AionPayDialog
                    dialogData={dialogData}
                />
            </div>
        );
    }
}

DevSection.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DevSection);
