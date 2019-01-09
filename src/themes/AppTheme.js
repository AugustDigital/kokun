import {createMuiTheme } from '@material-ui/core/styles';
const AppTheme = createMuiTheme({
    palette:{
        primary: { main: '#0f2752', contrastText: '#fff' },
        secondary: { main: '#ebebf5', contrastText: '#000'  },
        type:'dark',
        background:{default:'#ebebf5'},
        text: {
            primary:'#ebebf5',
            secondary:'#0f2752',
            disabled:'#0f2752',
            hint:'#0f2752',
        },
    },
    typography: {
        useNextVariants: true,
        fontFamily:['Lato']
    },
  });
  export default AppTheme