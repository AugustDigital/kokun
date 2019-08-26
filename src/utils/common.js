import ATSInterface from '../common/ATSInterface.js'
const { interval } = require('rxjs')
const {
    mergeMap,
    timeout,
    filter,
    take
} = require('rxjs/operators')

export async function compile(w3, sol) {
    return new Promise((resolve, reject) => {
        w3.eth.compile.solidity(sol, (err, res) => {
            if (err) {
                reject(err)
            }

            if (res) {
                resolve(res)
            }
        })
    })
}

export async function unlock(w3, addr, pw) {
    return new Promise((resolve, reject) => {
        w3.personal.unlockAccount(addr, pw, 999999, (err, unlock) => {
            if (err) reject(err)
            else if (unlock && unlock === true) {
                resolve(addr)
            } else {
                reject("unlock fail")
            }
        })
    })
}

export async function deploy(w3, acc0, abi, code, args) {
    return new Promise((resolve, reject) => {
        console.log('deploying')
        if (args && args.length > 0) {
            console.dir(args.split(','))
            w3.eth.contract(abi).new(
                ...args.split(','),
                {
                    from: acc0,
                    data: code,
                    gas: 4700000
                },
                (err, contract) => {
                    if (err) {
                        console.log('rejecting...')
                        reject(err)
                    } else if (contract && contract.address) {
                        console.log('resolving...')
                        resolve(contract)
                    }
                }
            )
        } else {
            w3.eth.contract(abi).new(
                {
                    from: acc0,
                    data: code,
                    gas: 4700000
                },
                (err, contract) => {
                    if (err) {
                        console.log('rejecting...')
                        reject(err)
                    } else if (contract && contract.address) {
                        console.log('resolving...')
                        resolve(contract)
                    }
                }
            )
        }
    })
}

export const poll = async (
    _function,
    _pollUntil = (arr) => !arr.length < 1 && arr,
    _interval = 1e3,
    _timeout = 60e3
) => {
    let counter = 0
    return new Promise((resolve, reject) => {
        interval(_interval)
            .pipe(
                //poll for data
                mergeMap(async () => await _function()),
                //verify data
                filter((item) => {
                    // console.log(counter++ + " : " + item)
                    counter++
                    return _pollUntil(item)
                }),
                take(1)
            )
            .pipe(timeout(_timeout))
            .subscribe(
                (x) => {
                    console.log("it took", counter, "seconds")
                    return resolve(x)
                },
                (x) => {
                    return reject(x)
                }
            )
    })
}

export const asPromise =  async (fun, params) => {
    return new Promise( (resolve, reject) =>{
        try{
            if(params && params.length){
                resolve(fun(...params)) 
            }else{
                resolve(fun())
            }
           
        }catch(ex){
            reject(ex)
        }
    })
}

export const isSolToken = async (web3, contractAddress) => {
    console.log({web3, contractAddress})
    console.log(ATSInterface)
    const tokenContract = new web3.eth.Contract(ATSInterface, contractAddress);
    try{
        const symbol = await tokenContract.methods.symbol().call();
        if(0 < symbol.length){
            return symbol;
        }
        return false;
    }catch(ex){
        return false;
    }
}

export const isJavaToken = async (web3, contractAddress, account) => {
    let data = web3.avm.contract.method('symbol').encode(); //todo UPDATE when ats if finalized
    const Tx = {
        from: account,
        to: contractAddress,
        data: data,
        gasPrice: 10000000000,
        gas: 2000000
    };
    try {
        let res = await web3.eth.call(Tx);
        let symbol = await web3.avm.contract.decode('string', res); 
        if(0 < symbol.length){
            return symbol;
        }
        return false;
    }catch(ex){
        return false;
    }
}