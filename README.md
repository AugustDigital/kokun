# Kokun

This component allows you to transfer Aion, AIP4 tokens, and sign smart contract transactions.

# Installing ReactJS component

Run the following command in your project directory:
```
$ [sudo] npm install kokun-0.0.3 -s
```

Import the component and pass the data as props:

```javascript
import React, { Component } from 'react';
import { AionPayButtonWidget } from 'kokun';
    
class MyApp extends Component {
    render() {
        return(<AionPayButtonWidget web3Provider='...'/>)
    }
}

export default MyApp;
```
## React Component Parameters
| Property     | Type    | Required |  Example |
| --------|---------|-------|-------|
| web3Provider  | string   | true    |"https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8"|
| address | string | false    |"0xa0d84a7c8409668f3249b1478ea8253e8f707004494fa9f50afc9012c8a5f7be"|
| amount | number | false    |1.2345|
| tokenAddress | string | false    |"0xa051aeecf95f7921c9f8ba3851445d7f221f9c7988a0d2d9ed0080eff583b313"|
| buttonText | string | false    |"Donate"|
| theme | json | false    | ```{primary: { main: '#113665', contrastText: '#fff' }, secondary: { main: '#F2F6FA', contrastText: '#113665',aionPay:{textColor:'#cca300',backgroundColor:'#000000',fontWeight:'500',fontSize:'11px',paddingTop:'6p',paddingBottom:'6p',paddingLeft:'16p',paddingRight:'16p'} }}``` |
| buttonIconType | string | false    |"dark" or "light"|
| transaction | json | false | ```{data:'0xf0a147ada0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb982700000000000000000de0b6b3a76400000000000000000000000000000000004000000000000000000000000000000000',gas: 2000000,gasPrice: 10000000000,to: '0xa051aeecf95f7921c9f8ba3851445d7f221f9c7988a0d2d9ed0080eff583b313',value: 0}```| 
|callback | function | false    | ```(txHash,status)=>console.log({txHash,status})```|


# Importing as JavaScript library
In your page create ```<aion-pay>``` tag then pass the data as attribute parameters. At the bottom of your html body add ```<script>``` tag pointing to the location of the library:
```html
<html>
    <body>
        <aion-pay  
            id='aion-pay-0' 
            data-web3-provider='...'></aion-pay>
	    <script type="text/javascript" src="https://www.kokun.co/kokun.js"></script>
    </body>
</html>
```

## aion-pay Tag Attributes
| Property     | Type    | Required |  Example |
| --------|---------|-------|-------|
| data-web3-provider  | string   | true    |"https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8"|
| data-address | string | false    |"0xa0d84a7c8409668f3249b1478ea8253e8f707004494fa9f50afc9012c8a5f7be"|
| data-amount | number | false    |1.2345|
| data-tokenAddress | string | false    |"0xa051aeecf95f7921c9f8ba3851445d7f221f9c7988a0d2d9ed0080eff583b313"|
| data-button-text | string | false    |Donate|
| data-theme | string | false    | ```"{ primary: { main: '#113665', contrastText: '#fff' }, secondary: { main: '#F2F6FA', contrastText: '#113665'} }"``` |
| data-button-icon-type | string | false    |"dark" or "light"|
| data-transaction | string | false | ```"{ data: '0xf0a147ada0f9b0086fdf6c29f67c009e98eb31e1ddf1809a6ef2e44296a377b37ebb982700000000000000000de0b6b3a76400000000000000000000000000000000004000000000000000000000000000000000', gas: 2000000, gasPrice: 10000000000, to: '0xa051aeecf95f7921c9f8ba3851445d7f221f9c7988a0d2d9ed0080eff583b313',value: 0 }"``` |

## aion-pay Tag Events
First assign an ```id``` attribute to your tag, then add a listener:
```javascript
document
    .getElementById('aion-pay-0')
    .addEventListener('transactionSent',
        function(e){
            alert('Got Event:'+e.detail.txHash+' with status '+e.detail.status);
        }
    )
```
