import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {AppTheme} from './themes/AppTheme';
import 'typeface-lato';
import ReactGA from 'react-ga';


ReactGA.initialize('UA-129745896-2',{
    debug: true,});

window.AionPayTheme = AppTheme
ReactDOM.render(
    <MuiThemeProvider theme={AppTheme}>
        <CssBaseline>
            <App />
        </CssBaseline>
    </MuiThemeProvider>,
    document.getElementById('root'));
registerServiceWorker();
