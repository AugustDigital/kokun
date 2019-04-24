import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {WidgetTheme} from '../themes/AppTheme';
import AionPayButton from './AionPayButton'


export default class AionPayButtonWidget extends React.Component{
    render(){
        
        return (
            <MuiThemeProvider theme={WidgetTheme}>
            <CssBaseline>
              <AionPayButton {...this.props}/>
              
              </CssBaseline>
            </MuiThemeProvider>
          );
    }
}