module.exports = {
    defaultBlockchain: "aion",
    blockchains: {
      aion: {
        networks: {
          development: {
            host: "http://178.128.227.209:8545",
            defaultAccount: "",
            password: ""
          },
          mainnet: {
            host:
              "https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8",
            defaultAccount: "",
            password: ""
          },
          testnet: {
            host:
              "https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8",
            defaultAccount: "",
            password: ""
          }
        }
      }
    }
  };
