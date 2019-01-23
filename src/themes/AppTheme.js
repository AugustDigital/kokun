import { createMuiTheme } from '@material-ui/core/styles';
const AppPalette = {
    primary: { main: '#113665', contrastText: '#fff' },
    secondary: { main: '#F2F6FA', contrastText: '#113665' },
    type: 'dark',
    background: { default: '#DCE1ED', white: '#fff', warning: '#E89000', error: '#e03051', blueGradient: 'linear-gradient(225deg, #08023C, #229DB7);' },
    text: {
        primary: '#F2F6FA',
        secondary: '#113665',
        disabled: '#113665',
        hint: '#2A2C2E',
        primaryLight: '#819ABA'
    },
    common: {
        green: '#5AF0BD',
        red: '#e50000',
        black: '#000',
        white: '#fff',
        icon: '#d2dbe6',
        primaryButton: '#2197B3',
        primaryButtonDisabled: 'rgba(33,151,179,0.4)',
        underline:'#D8D8D8',
        underlineFocused:'#113665',
        underlineContrast:'#D8D8D8',
        underlineFocusedContrast:'#D8D8D8',
    },
    providerPanel: {
        background: '#fff',
        border: '#5AF0BD',
        text: '#113665'
    }
}
const WidgetPalette = {
    primary: { main: '#113665', contrastText: '#fff' },
    secondary: { main: '#113665', contrastText: '#fff' },
    type: 'dark',
    background: { default: '#ECF1F7', white: '#fff', warning: '#E89000', error: '#e03051', blueGradient: 'linear-gradient(225deg, #08023C, #229DB7);',aionPay:'#113665' },//can cause issues when exported as a widget lib
    text: {
        primary: '#113665',
        secondary: '#F2F6FA',
        disabled: '#F2F6FA',
        hint: '#2A2C2E',
        primaryLight: '#819ABA'
    },
    common: {
        green: '#5AF0BD',
        black: '#000',
        white: '#fff',
        icon: '#d2dbe6',
        primaryButton: '#113665',
        primaryButtonDisabled: 'rgba(17, 54, 101, 0.4)',
        underline:'#D8D8D8',
        underlineFocused:'#113665',
        underlineContrast:'#113665',
        underlineFocusedContrast:'#113665',
    },
    providerPanel: {
        background: '#ECF1F7',
        border: '#0D1F53',
        text: '#113665'
    }
}
const AppTypography = {
    useNextVariants: true,
    fontFamily: ['Lato']//can cause issues when exported as a widget lib
}
const AppTheme = createMuiTheme({
    palette: AppPalette,
    typography: AppTypography,
});
const WidgetTheme = createMuiTheme({
    palette: WidgetPalette,
    typography: AppTypography,
});

export { AppTheme, WidgetTheme };
