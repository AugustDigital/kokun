const env = process.env.NODE_ENV===null || typeof process.env.NODE_ENV ==='undefined'?process.env.NODE_ENV:'development';

const config = {
    "production": "https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8",
    "development": "https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8"
};
module.exports = config[env];
