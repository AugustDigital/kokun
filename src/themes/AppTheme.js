import { createMuiTheme } from '@material-ui/core/styles';
const AppTheme = createMuiTheme({
    palette: {
        primary: { main: '#113665', contrastText: '#fff' },
        secondary: { main: '#F2F6FA', contrastText: '#113665' },
        type: 'dark',
        background: { default: '#DCE1ED', white:'#fff', blueGradient:'linear-gradient(225deg, #08023C, #229DB7);' },//can cause issues when exported as a widget lib
        text: {
            primary: '#F2F6FA',
            secondary: '#113665',
            disabled: '#113665',
            hint: '#113665',
        },
        common:{
            green:'#5AF0BD',
            black:'#000',
            white:'#fff',
            icon:'#d2dbe6',
            primaryButton:'#2197B3',
        }
    },
    typography: {
        useNextVariants: true,
        fontFamily: ['Lato']//can cause issues when exported as a widget lib
    },
});
export default AppTheme
