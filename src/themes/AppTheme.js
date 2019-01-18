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
        hint: '#113665',
        primaryLight: '#819ABA'
    },
    common: {
        green: '#5AF0BD',
        black: '#000',
        white: '#fff',
        icon: '#d2dbe6',
        primaryButton: '#2197B3',
    },
    providerPanel: {
        background: '#fff',
        border: '#5AF0BD',
        text: '#113665'
    }
}
const WidgetPalette = {
    primary: { main: '#113665', contrastText: '#fff' },
    secondary: { main: '#F2F6FA', contrastText: '#113665' },
    type: 'dark',
    background: { default: '#DCE1ED', white: '#fff', warning: '#E89000', error: '#e03051', blueGradient: 'linear-gradient(225deg, #08023C, #229DB7);' },//can cause issues when exported as a widget lib
    text: {
        primary: '#113665',
        secondary: '#F2F6FA',
        disabled: '#F2F6FA',
        hint: '#F2F6FA',
        primaryLight: '#819ABA'
    },
    common: {
        green: '#5AF0BD',
        black: '#000',
        white: '#fff',
        icon: '#d2dbe6',
        primaryButton: '#113665',
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
