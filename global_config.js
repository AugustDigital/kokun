

const config = {
    "production": "https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8",
    "development": "https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8"
};
export const defaultProvider = config.production;
export const productionProvider = config.production;
export const developmentProvider = config.development;
