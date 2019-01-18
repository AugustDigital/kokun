import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Button, Grid, Paper } from '@material-ui/core'
import AionLogoDark from '../assets/aion_logo_dark.svg'
import AionPayDialog from './AionPayDialog'
import { inject } from './AionPayButton'

const styles = theme => ({
    card: {
        backgroundColor: theme.palette.background.white,
        marginTop: theme.spacing.unit * 2,
        borderRadius: '6px'
    },
    cardHeading: {
        backgroundImage: theme.palette.background.blueGradient,
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
        { description: 'Pay to any address with default button style', onClick: this.onPayButtonClick, params: {} },
        { description: 'Pay to a given address with default button style', onClick: this.onPayButtonClick, params: { 'data-address': '0x0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827' } },
        { description: 'Pay to a given address with custom text and background but with AION icon on the button.', onClick: this.onPayButtonClick, params: { 'data-button-text': 'AION PAY', 'data-button-background': '#ff0000', 'data-address': '0x0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827' } },
        { description: 'Pay to a given address with custom style.', onClick: this.onPayButtonClick, params: { 'data-style': 'todo json string', 'data-address': '0x0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827' } },
    ]
    componentDidMount() {
        inject()
    }

    onGithubButtonPressed = () => {
        window.open('https://github.com/alwaysaugust');
    }

    onPayButtonClick = () => {
        this.setState({
            dialogData: { field: 'todo' }
        })
    }
    paramsToString = (item) => {
        const paramsJson = Object.keys(item).map((key) => {
            return key + '=\'' + item[key] + '\''
        }).join(' ');
        return paramsJson.length > 0 ? ' ' + paramsJson : '';
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
                        <aion-pay {...item.params} />
                        <Grid item xs>
                            <Typography variant="subtitle2" className={classes.snippet} style={{ fontWeight: 'light' }}> &lt;aion-pay{this.paramsToString(item.params)}&gt;&lt;/aion-pay&gt; </Typography>
                        </Grid>
                    </Grid>

                </div>

            </Grid>
        })
        return (
            <div className={this.props.className}>
                <Typography color='textSecondary' variant="h6" style={{ fontWeight: 'bold' }}>
                    <img alt="Aion Logo" className={classNames(classes.leftIcon, classes.iconSmall, classes.iconHeading)} src={AionLogoDark} />
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
