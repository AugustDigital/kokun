import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './Home';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppTheme from './themes/AppTheme';
import 'typeface-lato';
ReactDOM.render(
    <MuiThemeProvider theme={AppTheme}>
        <CssBaseline>
            <Home/>
        </CssBaseline>
    </MuiThemeProvider>,
    document.getElementById('root'));
registerServiceWorker();
