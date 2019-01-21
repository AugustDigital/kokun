import Web3 from 'aion-web3'


export default function getWeb3(host) {
    const provider = new Web3.providers.HttpProvider(host)
    
    return new Web3(provider)
}

