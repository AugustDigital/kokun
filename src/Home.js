import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Transaction} from "./common/Transaction";
import {SignedTransaction} from "./common/SignedTransaction";
import {TxnResponse} from "./common/TxnResponse";
import {Constant} from "./common/Constant";
import * as CryptoUtil from "./providers/util/CryptoUtil";
import PrivateKeyWalletProvider from "./providers/impl/PrivateKeyWalletProvider";
import * as TransactionUtil from "./providers/util/TransactionUtil";
import AionPayService from "./AionPayService";

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Accounts = require('aion-keystore');

const styles = theme => ({

    input: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },

    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit * 2
    },
    formItem: {
        minWidth: "240px"
    }
});

class Home extends Component{

  constructor(props){
      super(props)
      this.encodedTxn = SignedTransaction;
      this.txnResponse = TxnResponse;
      this.provider = null;
      this.service = new AionPayService('https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8');
      this.amount;

      this.state = {
          privateKey: '',
          provider: null,
          from:'',
          fromBalance: null,
          isError: '',
          errors: '',
          visible: false,
          inputDialogEnable: false,
          isNotification: false,
          notification:'',
          value: null,
          gas: TransactionUtil.defaultNrgLimit,
          gasPrice: TransactionUtil.defaultNrgPrice,
          _to: '',
          readonly: false,
          to_readonly: false,
          message: '',
          txnDone: false,
          txnInProgress: false
      }
  }



  async updateBalance() {

      this.service.fetchBalance(this.state.from).then(result => {

          this.setState({
              fromBalance:CryptoUtil.convertnAmpBalanceToAION(result)
          })

      }).catch(error =>{
          console.log(error)
          this.setState({
              isError:true,
              errors: "Error getting balance for the address " + error
          })

      })
  }

  handleHidePaymentDialog() {
      this.setState({
          visible:false,
          inputDialogEnable: false
      })

    this.handleResetData()
  }

  handleResetData() {
    //dialog state
    this.setState({
        txnInProgress:false,
        showConfirm:false,
        txnDone:false,
        visible:false
    })


    //sender state
    this.resetFromAddressData()

    //txn state
    if(!this.state.to_readonly) { //only reset when not set through props
      this.setState({
        _to:''
      })
    }

    this.setState({
        value: 0,
        message: '',
        gas:TransactionUtil.defaultNrgLimit,
        gasPrice:TransactionUtil.defaultNrgPrice,

        //error state
        isError:false,
        errors: 0,

        isNotification:false,
        notification:''
    })

    //response state
    this.resetTxnResponse()
  }
  resetTxnResponse() {

    this.txnResponse.txHash = ''
    this.txnResponse.msgHash = ''
    this.txnResponse.error = ''
    this.txnResponse.txResult = ''
    this.txnResponse.status = ''

  }

  resetFromAddressData() {
     this.state.privateKey = ''
     this.setState({
         from:'',
         fromBalance:null
     })
  }

  async handleDerivePublicKey() {

    //If private key field is empty. just return. It will be checked again while sending the transaction.
    if (!this.state.privateKey || this.state.privateKey.trim().length == 0)
      return

    try {

        this.provider = new PrivateKeyWalletProvider(this.state.privateKey);

         this.setState({
             isError: false,
         });


      let [address] = await this.provider.unlock(null)

      if (address)
        this.setState({
            from: address
        })

      this.updateBalance()

    } catch (error) {
      this.state.from = ''
      this.state.fromBalance = null
      this.state.isError = true
      this.setState({
          errors: "Public Key derivation failed: " + error.toString()
      })
    }
  }

  handlePrivateKeyInput(event) {

    this.state.privateKey = event.target.value;

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  handleFromInput(event) {
    this.setState({
        from: event.target.value
    })

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  handleShowInputDialog() {//step 2

    if(!this.state.from) {
        this.setState({
            isError: true,
            errors:"Please select a wallet provider and unlock it."
        })

      return
    }

    this.setState({
        visible: false,
        inputDialogEnable: true
    })
  }

  handleHideError() {
      this.setState({
         isError:false,
         errors: ''
      })
  }

  handleHideNotification() {
      this.setState({
         isNotification:false,
         notification: null
      })
  }

  handleToInput(event) {
      this.setState({
        _to: event.target.value
      })

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  handleValueInput(event) {
      this.setState({
          value: event.target.value
      })

    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  handleNrgInput(event) {
      this.setState({
        gas: event.target.value
      })
  }

  handleNrgPriceInput(event) {
      this.setState({
        gasPrice: event.target.value
      })
  }

  handleMessageInput(event) {
      this.setState({
        message: event.target.value
      })
  }

  validateInput() {

    this.handleHideError()

    if (isNaN(this.state.value)) {
        this.setState({
            isError:true,
            errors: "Amount is not valid"
        })
    }

      if (!this.state.privateKey || this.state.privateKey.trim().length == 0) {
          this.setState({
              isError:true,
              errors: "Private key can not be empty"
          })
      }

    if (!this.state._to || this.state._to.trim().length == 0) {

        this.setState({
            isError:true,
            errors: "To address can not be empty"
        })
    }

    return !this.state.isError
  }

  async signPayment(e) {

    e.preventDefault()
    let err = this.validateInput();
    if (!err) {
      console.log('not a valid input')
      return
    }

    console.log("All valid input")

    if (!this.state._to) {
      this.handleDerivePublicKey()
    }

    console.log("lets do signing first..")

    this.amount = CryptoUtil.convertAIONTonAmpBalance(this.state.value);


    let txn = Transaction;
    txn.to = this.state._to
    txn.value = this.amount
    txn.timestamp = Date.now() * 1000;

    if(this.state.message) {
      txn.data = this.state.message
    }

    txn.gas = this.state.gas + ''
    txn.gasPrice = this.state.gasPrice + ''

    //Get nonce and nrgPrice
    let retVal = null
    try {
      retVal = await this.service.fetchNonceNrg(this.state.from, txn)

    } catch (e) {
        console.log(e)
        this.setState({
            isError: true,
            errors: "Error to get nonce for the address [Reason] " + e,
        })
        return;
    }

    if (!retVal) { //Not able to get nonce and estimated nrg
        this.setState({
            isError: true,
            errors: "Unable to get nonce and nrgPrice from AION kernel"
        })
      return
    }
    //End - Get nonce & nrgPrice

    txn.nonce = retVal[0]

    //Check nrglimit with estimated nrg
    let estimatedNrg = retVal[1]
    /*if (estimatedNrg && estimatedNrg > 0) {
      if(Number(txn.gas) < estimatedNrg) {
        let r = confirm("Estimated Nrg     : " + estimatedNrg + "\nDefault Nrg Limit : " + txn.gas
        +"\n\nDo you want to update the Nrg Limit to " + estimatedNrg + "?");

        if(r == true) {
          this.gas = estimatedNrg
          return
        } else {
          //Just continue;
        }
      }
  }*/

    console.log("Fetching current nonce " + txn.nonce)

    try {
        const aionKeystore = new Accounts();
        const account = aionKeystore.privateKeyToAccount(this.state.privateKey);
        this.encodedTxn = await account.signTransaction(txn);

        //this.encodedTxn = await this.provider.sign(txn) //TransactionUtil.signTransaction(txn, this.state.privateKey)

    } catch (error) {
      this.setState({
          isError: true,
          errors: "Error in signing transaction. Please refresh and try again " + error
      })
    }

    //this.encodedTxn.input.from = this.state.from

    this.setState({
        showConfirm:true,
        visible:false,
        inputDialogEnable:false
    })

  }

  async confirmPayment() {
      this.setState({
        showConfirm:false,
      })

      this.submitRawTransansaction(this.encodedTxn.rawTransaction)
  }

  async submitRawTransansaction(encodedTx) {

      this.setState({
         txnInProgress:true,
         txnDone: false
      })

    try {
      //transaction submitted events
      //this.transactionInProgress.emit({refId: this.refId, data: encodedTx})

      this.txnResponse = await this.service.sendTransaction(encodedTx)

      this.setState({
        txnDone:true
      })

      //Emit transaction successful event
      //this.transactionCompleted.emit({refId: this.refId, data: this.txnResponse})

    } catch (error) {

        this.setState({
            txnDone: true,
            isError:true,
            errors: "Error sending the transaction " + error
        })
      //Emit transaction failed
      //this.transactionFailed.emit({refId: this.refId, data: error.toString()})
    }
  }

  render(){

      const { classes } = this.props;

      return(
          <div className={classes.root}>
          <div>
            <div>
              <TextField id="private_key" label="Private Key" className={classes.formItem} value={this.state.privateKey}
                     type="password"
                     onChange={this.handlePrivateKeyInput.bind(this)}
                     onBlur={this.handleDerivePublicKey.bind(this)} />
            </div>
          </div>

          <div>
            <label>&nbsp;&nbsp;</label>
            <div>
              <TextField id="from" label="From Address" className={classes.input} value={this.state.from}
                     onChange={this.handleFromInput.bind(this)}
                     readOnly={true} disabled/>
              {this.state.fromBalance ?
                <label>Balance: {this.state.fromBalance} AION</label> : null
              }
            </div>
          </div>

          <footer>
            <button disabled={!this.state.from}
                    onClick={this.handleShowInputDialog.bind(this)}>Next</button>
          </footer>


          {this.state.inputDialogEnable ?
            this.renderInputForm() : null
          }

          {this.state.txnInProgress ?
            this.renderTxnInProgress() : <div></div>
          }

          {this.state.showConfirm ?
            this.renderShowConfirmation() : null
          }

          </div>

      )
  }

  renderInputForm() {

    const { classes } = this.props;

    return(
      <div>
        <div>
          <div></div>
          <div>
            <header>
              <img src={Constant.aion_logo}></img>
              <p>Transfer AION</p>
              <button aria-label="close" onClick={this.handleHidePaymentDialog.bind(this)}>&times;</button>
            </header>
            <section>

              {this.renderError()}

              {this.renderNotification()}

              <div>
                <label htmlFor="from">From</label>
                <div>
                  <TextField id="from" label="From Address" className={classes.input} value={this.state.from}
                         onChange={(e) => this.handleFromInput(e)}
                         readOnly={true}
                         disabled/>
                  {this.state.fromBalance ?
                    <label>Balance: {this.state.fromBalance} AION</label> : null
                  }
                </div>
              </div>

              <div>
                <div>
                <TextField id="to" label="To Address"
                       className={classes.input} value={this.state._to || ''}
                       onChange={this.handleToInput.bind(this)}
                       readOnly={this.state.to_readonly || this.state.readonly}
                />
                </div>
              </div>

              <div>
                <div>
                <TextField id="value" label="Enter amount" className={classes.input} value={this.state.value}
                       type="number"
                       onChange={this.handleValueInput.bind(this)}
                       readOnly={this.state.readonly}
                />
                </div>
              </div>

              <div>
                <div>
                <div>
                  <label htmlFor="nrg">Nrg Limit</label>
                  <div>
                    <TextField id="nrg" placeholder="Nrg Limit" className={classes.input} value={this.state.gas}
                           type="number"
                           onChange={this.handleNrgInput.bind(this)}
                    />
                  </div>
                </div>

                </div>
                <div>
                <div>
                  <label htmlFor="nrgPrice">Nrg Price</label>
                  <div>
                    <TextField id="nrgPrice" placeholder="Nrg Price" className={classes.input} value={this.state.gasPrice}
                           type="number"
                           onChange={this.handleNrgPriceInput.bind(this)}
                    />
                  </div>
                </div>
                </div>
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <div>
                  <textarea id="message" placeholder="Optional message"
                            onChange={this.handleMessageInput.bind(this)}
                            readOnly={this.state.readonly}
                            value={this.state.message}/>
                </div>
              </div>
            </section>

            <footer>
              <button onClick={this.signPayment.bind(this)}>Next
              </button>
              <button onClick={this.handleHidePaymentDialog.bind(this)}>Cancel
              </button>
            </footer>

          </div>
        </div>
      </div>
    )
  }

  renderError() {

    return (
      <div>
        {this.state.isError ?
          <div>
            <button onClick={this.handleHideError.bind(this)}></button>
            <ul>
              <li>{this.state.errors}</li>)
            </ul>
          </div> : null
        }
      </div>
    );
  }

  renderNotification() {
    return (
      <div>
        {this.state.isNotification ?
          <div>
            <button onClick={this.handleHideNotification.bind(this)}></button>
            {this.notification}
          </div> : null
        }
      </div>
    )
  }

  renderTxnInProgress() {
    return (
      <div>
        <div>
          <div></div>
          <div>
            <header>
              <img src={Constant.aion_logo}></img>
              <p>Sending AION</p>
              <button aria-label="close" onClick={this.handleHidePaymentDialog.bind(this)}>&times;</button>
            </header>
            <section>
              {this.renderError()}

              {!this.state.txnDone ?
                <div>
                  <div>Loading ...</div>
                  &nbsp; <i>Sending transaction and waiting for at least one block confirmation. Please wait ...</i>
                </div> :
                <div>
                  {this.txnResponse.txHash ?
                    <span>
                        Transaction Hash: <a
                      href={Constant.explorer_base_url + "transaction/" + this.txnResponse.txHash}
                      target="_blank">{this.txnResponse.txHash}</a>
                        </span> : <span>Transaction could not be completed</span>
                  }
                </div>
              }

            </section>
          </div>
        </div>
      </div>
    )
  }

  renderShowConfirmation() {
    return (
      <div>
        <div></div>
        <div>
          <header>
            <img src={Constant.aion_logo}></img>
            <p>Confirm Transaction</p>
            <button aria-label="close" onClick={this.handleHidePaymentDialog.bind(this)}>&times;</button>
          </header>
          <section>

            {this.renderError()}

            <div>
              <div><label>From</label></div>
              <div>{this.state.from}</div>
            </div>
            <div>
              <div>To</div>
              <div>
                {this.state._to}
              </div>
            </div>
            <div>
              <div>Value</div>
              <div>{CryptoUtil.convertnAmpBalanceToAION(this.state.value)} AION</div>
            </div>
            <div>
              <div>Nrg</div>
              <div>{this.state.gas}</div>
            </div>
            <div>
              <div>Nrg Price</div>
              <div>{this.state.gasPrice}</div>
            </div>
            <div>
              <div>Raw Transaction</div>
              <div>
                <textarea rows={10} readOnly={true} value={this.encodedTxn.rawTransaction} />
              </div>
            </div>
          </section>
          <footer>
            <button type="button" onClick={this.confirmPayment.bind(this)}>Confirm
            </button>
            <button type="button" onClick={this.handleHidePaymentDialog.bind(this)}>Close
            </button>
          </footer>
        </div>
      </div>
    )
  }

}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
