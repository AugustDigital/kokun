import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Typography, Grid, Paper, IconButton, Input, InputAdornment } from '@material-ui/core'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import { FileCopy } from '@material-ui/icons'
import AionPayLogoDark from '../assets/aion_pay_logo_dark.svg'
import AionPayDialog from './AionPayDialog'
import { inject } from './AionPayButton'
import SecondaryButton from '../components/SecondaryButton'

const themeExample = {
    primary: { main: '#113665', contrastText: '#fff' },
    secondary: { main: '#F2F6FA', contrastText: '#113665' },
    type: 'dark',
    background: { default: '#DCE1ED', white: '#fff', warning: '#E89000', error: '#e03051', blueGradient: 'linear-gradient(225deg, #08023C, #229DB7);' },
    text: {
        primary: '#F2F6FA',
        secondary: '#00ff00',
        disabled: '#113665',
        hint: '#2A2C2E',
        primaryLight: '#819ABA'
    },
    common: {
        green: '#5AF0BD',
        black: '#000',
        white: '#fff',
        icon: '#d2dbe6',
        primaryButton: '#00ff00',
        primaryButtonDisabled: 'rgba(33,151,179,0.4)',
        underline:'#D8D8D8',
        underlineFocused:'#113665',
        underlineContrast:'#D8D8D8',
        underlineFocusedContrast:'#D8D8D8',
    },
    providerPanel: {
        background: '#00ff00',
        border: '#5AF0BD',
        text: '#113665'
    }
}
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
        textAlign: 'right',
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
            marginTop: theme.spacing.unit * 2
        }
    },
    sampleInfo:{
        marginTop: theme.spacing.unit * 3,
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing.unit * 4
        }
    },
    snippetContainer: {
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing.unit * 2
        }
    },
    buttonContainer:{
        textAlign:'left',
        [theme.breakpoints.down('xs')]: {
            textAlign:'center',
            width: '100%'
        }
    },
    snippet: {
        padding: theme.spacing.unit * 2,
        backgroundColor: 'rgb(239,244,249)',
        color: 'black',
        marginLeft: theme.spacing.unit * 2,
        borderRadius: '4px',
        border: 'none',
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            marginLeft:'0px'
        }
    },
    cardContent: {
        padding: theme.spacing.unit * 4,
    },
    aionPayIcon:{
        height:'28px'
    },
    copyButton: {
        marginLeft: theme.spacing.unit * 2,
        [theme.breakpoints.down('xs')]: {
            marginLeft:'0px'
        }
    }
})
class DevSection extends Component {

    state = {
        dialogData: null
    }
    
    content = [
        { description: 'Pay to any address with default button style', params: { 'data-web3-provider': 'https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8' } },
        { description: 'Pay to a given address with default button style', params: { 'data-address': '0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827', 'data-web3-provider': 'https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8' } },
        { description: 'Pay to a given address with custom text and background but with AION icon on the button.', params: { 'data-button-text': 'Aion Pay', 'data-button-background': '#113665', 'data-button-text-color': '#ffffff','data-button-icon-type': 'light',  'data-address': '0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827', 'data-web3-provider': 'https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8' } },
        { description: 'Pay to a given address with custom style.', params: { 'data-style': JSON.stringify(themeExample), 'data-address': '0xa0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb9827', 'data-web3-provider': 'https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8' } },
    ]
    componentDidMount() {
        inject()
    }

    onGithubButtonPressed = () => {
        window.open('https://github.com/alwaysaugust/kokun');
    }

    paramsToString = (item) => {
        const paramsJson = Object.keys(item).map((key) => {
            return key + '=\'' + item[key] + '\''
        }).join(' ');
        return paramsJson.length > 0 ? ' ' + paramsJson : '';
    }
    copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    render() {
        const { classes, width } = this.props;
        const { dialogData } = this.state;

        const contentItems = this.content.map((item, index) => {
            const snippetText = '<aion-pay ' + this.paramsToString(item.params) + '></aion-pay>';
            return <Grid key={index} item>
                <div className={classes.sampleInfo}>
                    <Typography color='textSecondary' variant="h6" style={{ fontWeight: '400' }}>{index + 1}. {item.description}</Typography>
                    <Grid
                        container
                        style={{ marginTop: '15px' }}
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        <div className={classes.buttonContainer}>
                            <aion-pay  {...item.params} />
                        </div>
                        

                        <Grid item xs={12} sm className={classes.snippetContainer}>
                            <Input
                                className={classes.snippet}
                                type={'text'}
                                value={snippetText}
                                readOnly
                                multiline={!isWidthUp('sm', width)}
                                rowsMax={5}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton title='Copy to clipboard' className={classes.copyButton} color="primary" aria-label="Copy" onClick={() => { this.copyToClipboard(snippetText) }}>
                                            <FileCopy />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                    </Grid>

                </div>

            </Grid>
        })
        return (
            <div className={this.props.className}>
                <img alt="Aion Pay Logo" className={classNames(classes.aionPayIcon)} src={AionPayLogoDark} />
                <Paper className={classes.card}>
                    <div>
                        <div className={classes.cardHeading}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                wrap="wrap">
                                <Grid item xs={12} sm={7}>
                                    <div>
                                        <Typography variant="h6" style={{ fontWeight: '400' }}>Easily accept Aion payments on your site</Typography>
                                        <Typography variant="subtitle2" style={{ fontWeight: 'light', marginTop: '15px' }}>By simply pasting a line of code to your site, Aion Pay makes it simple to accept Aion payments anywhere. The button can be styled as required and can be set to accept payment to a predetermined address or to an address chosen by the payee</Typography>

                                    </div>
                                </Grid>

                                <Grid item xs={12} sm={5}
                                    className={classes.githubButtonContainer}>
                                    <SecondaryButton
                                        className={classes.githubButton}
                                        onClick={this.onGithubButtonPressed}
                                        text='GitHub'/>
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

export default compose(
    withStyles(styles, { name: 'DevSection' }),
    withWidth()
  )(DevSection);
