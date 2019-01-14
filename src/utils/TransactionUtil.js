import rlp from "aion-rlp";
import {AionLong} from "aion-rlp";
import BN from "bn.js";
import nacl from 'tweetnacl';
import {Buffer} from 'buffer'

import {Transaction} from "../common/Transaction"
import * as CryptoUtil from "./CryptoUtil"
import {SignedTransaction} from "../common/SignedTransaction";

export const defaultNrgPrice = 10000000000
export const defaultNrgLimit = 22000;

export function signTransaction(transaction, privateKey) {

    if(privateKey) {
        if(privateKey.startsWith("0x"))
        privateKey = privateKey.substring(2)
    }

    const rlpOutput = rlpEncode(transaction);

    const hash = CryptoUtil.blake2b256(rlpOutput)

    //sign with ncal
    const privateKeyBuff = CryptoUtil.hex2ua(privateKey)

    const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyBuff)

    // console.log("Public key: " + CryptoUtil.uia2hex(keyPair.publicKey))

    const signature = nacl.sign.detached(hash, keyPair.secretKey)

    // console.log("***" + signature)

    if (nacl.sign.detached.verify(hash, signature, keyPair.publicKey) === false) {
      throw new Error('Could not verify signature.')
    }

    /** Uncomment for debugging **/
    // console.log("public key length: " + nacl.sign.publicKeyLength)
    // console.log("signature length: " + nacl.sign.signatureLength)
    //
    // console.log("public key length: " + keyPair.publicKey.length)
    // console.log("signature length: " + signature.length)
    // console.log("singature: " + CryptoUtil.uia2hex(signature, true))

    // address + message signature length
    let aionPubSigLen = nacl.sign.publicKeyLength + nacl.sign.signatureLength
    // aion-specific signature scheme
    const aionPubSig = CryptoUtil.concatBuffer(keyPair.publicKey, signature, aionPubSigLen)

    // add the aion pub-sig
    // @ts-ignore
    const rawTx = rlp.decode(rlpOutput).concat(Buffer.from(aionPubSig))

    // re-encode with signature included
    const rawTransaction = rlp.encode(rawTx)

    // console.log(rawTransaction)

    const rawTransactionHash = CryptoUtil.uia2hex(rawTransaction)

    // @ts-ignore
    console.log(rawTransactionHash)

    let signedTransaction = SignedTransaction;
    signedTransaction.messageHash = CryptoUtil.uia2hex(hash)
    signedTransaction. signature = CryptoUtil.uia2hex(aionPubSig)
    signedTransaction.rawTransaction = CryptoUtil.uia2hex(rawTransaction)
    signedTransaction.input = transaction

    return signedTransaction
}

export function verifyAndEncodedSignTransaction(transaction, rlpEncoded, signature, publicKey) {
     const hash = CryptoUtil.blake2b256(rlpEncoded)

    // alert("pubkey" + publicKey)
    if (nacl.sign.detached.verify(hash, signature, publicKey) === false) {
      //throw new Error('Could not verify signature.')
      console.log("Could not verify the signature from ledger")
    }

    /*** Uncomment for debugging **/
    // console.log("public key length**: " + publicKey.length)
    // console.log("signature length**: " + signature.length)

    // address + message signature length
    let aionPubSigLen = nacl.sign.publicKeyLength + nacl.sign.signatureLength

    // aion-specific signature scheme
    const aionPubSig = CryptoUtil.concatBuffer(publicKey, signature, aionPubSigLen)

    // add the aion pub-sig
    // @ts-ignore
    const rawTx = rlp.decode(rlpEncoded).concat(Buffer.from(aionPubSig))

    // re-encode with signature included
    const rawTransaction = rlp.encode(rawTx)

    const rawTransactionHash = CryptoUtil.uia2hex(rawTransaction)

    // @ts-ignore
    console.log(rawTransactionHash)

    let signedTransaction = new SignedTransaction()
    signedTransaction.messageHash = CryptoUtil.uia2hex(hash)
    signedTransaction.signature = CryptoUtil.uia2hex(aionPubSig)
    signedTransaction.rawTransaction = CryptoUtil.uia2hex(rawTransaction)
    signedTransaction.input = transaction

    return signedTransaction

}

export function rlpEncode(transaction) { //return Uint8Array
    const txArray = new Array()

    if (transaction.to) {
      transaction.to = transaction.to.toLowerCase()

      if (!transaction.to.startsWith("0x"))
        transaction.to = "0x" + transaction.to
    }

    txArray.push(new BN(transaction.nonce))
    txArray.push(transaction.to)
    txArray.push(transaction.value)
    txArray.push(transaction.data)


    if (transaction.timestamp !== 0)
      txArray.push(transaction.timestamp)
    else {
      transaction.timestamp = Date.now() * 1000 //in micro second
      txArray.push(transaction.timestamp)
    }

    if (transaction.gas)
      txArray.push(new AionLong(new BN(transaction.gas)))
    else {
      transaction.gas = "22000";
      txArray.push(new AionLong(new BN(transaction.gas)))
    }

    if (transaction.gasPrice) {
      txArray.push(new AionLong(new BN(transaction.gasPrice)))
    } else {
      transaction.gasPrice = this.defaultNrgPrice.toString()
      txArray.push(new AionLong(new BN(transaction.gasPrice)))
    }

    if (transaction.type !== 0)
      txArray.push(transaction.type)
    else {
      transaction.type = 1
      txArray.push(transaction.type)
    }

    const rlpOutput: Uint8Array = rlp.encode(txArray)
    return rlpOutput;
}

export function getAddress(privateKey) {
    //sign with ncal
    const privateKeyBuff = CryptoUtil.hex2ua(privateKey)

    const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyBuff)

    return [CryptoUtil.createA0Address(keyPair.publicKey), CryptoUtil.uia2hex(keyPair.publicKey)];

}
