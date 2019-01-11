import * as TransactionUtil from "../util/TransactionUtil";

class PrivateKeyWalletProvider{

  constructor(privateKey) {

      this.privateKey = privateKey;

      this.address = null;

      this.publicKey = null;

  }

  async unlock(progressCallback){

    try {
      let [address, publicKey] = TransactionUtil.getAddress(this.privateKey)

      this.address = address
      this.publicKey = publicKey

      if (progressCallback)
        progressCallback(100)

      return [address, publicKey]
    } catch (e) {
      console.log(e)
      throw e
    }

  }

  async sign(transaction){

    let mainThis = this
    if (!mainThis.privateKey) {
      throw new Error("Can not sign a transaction with null privatekey")
    }

    let encodedSignedTxn = TransactionUtil.signTransaction(transaction, mainThis.privateKey)
    return encodedSignedTxn

  }
}

export default PrivateKeyWalletProvider;
