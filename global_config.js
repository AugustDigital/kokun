const env =
  process.env.NODE_ENV === null || typeof process.env.NODE_ENV === "undefined"
    ? "development"
    : process.env.NODE_ENV;
const keyterpillarAbi = [
  {
    outputs: [
      {
        name: "",
        type: "uint128"
      }
    ],
    constant: true,
    payable: false,
    inputs: [],
    name: "keyTypeCount",
    type: "function",
    signature: "0x0df397c6"
  },
  {
    outputs: [],
    constant: false,
    payable: false,
    inputs: [
      {
        name: "addKeyFee",
        type: "uint128"
      },
      {
        name: "addKeyTypeFee",
        type: "uint128"
      }
    ],
    name: "setFees",
    type: "function",
    signature: "0x32760c7a"
  },
  {
    outputs: [],
    constant: false,
    payable: false,
    inputs: [],
    name: "withdraw",
    type: "function",
    signature: "0x3ccfd60b"
  },
  {
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    constant: true,
    payable: false,
    inputs: [
      {
        name: "keyType",
        type: "uint128"
      }
    ],
    name: "getKeyTypeName",
    type: "function",
    signature: "0x78b9972e"
  },
  {
    outputs: [],
    constant: false,
    payable: true,
    inputs: [
      {
        name: "userName",
        type: "string"
      },
      {
        name: "key",
        type: "string"
      },
      {
        name: "keyType",
        type: "uint128"
      }
    ],
    name: "addKey",
    type: "function",
    signature: "0x8d3df455"
  },
  {
    outputs: [
      {
        name: "",
        type: "uint128[]"
      }
    ],
    constant: true,
    payable: false,
    inputs: [
      {
        name: "userName",
        type: "string"
      }
    ],
    name: "getKeyIndexes",
    type: "function",
    signature: "0xaed8410a"
  },
  {
    outputs: [],
    constant: false,
    payable: true,
    inputs: [
      {
        name: "keyName",
        type: "string"
      }
    ],
    name: "addKeyType",
    type: "function",
    signature: "0xba9a10a0"
  },
  {
    outputs: [
      {
        name: "",
        type: "uint128[]"
      }
    ],
    constant: true,
    payable: false,
    inputs: [
      {
        name: "userName",
        type: "string"
      },
      {
        name: "keyType",
        type: "uint128"
      }
    ],
    name: "getKeyIndexesWithType",
    type: "function",
    signature: "0xf37626f8"
  },
  {
    outputs: [
      {
        name: "",
        type: "uint128"
      }
    ],
    constant: true,
    payable: false,
    inputs: [],
    name: "keyCount",
    type: "function",
    signature: "0xfac750e0"
  },
  {
    outputs: [
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      }
    ],
    constant: true,
    payable: false,
    inputs: [
      {
        name: "userName",
        type: "string"
      },
      {
        name: "keyIndex",
        type: "uint128"
      }
    ],
    name: "getKey",
    type: "function",
    signature: "0xff3499fe"
  },
  {
    outputs: [],
    payable: false,
    inputs: [],
    name: "",
    type: "constructor"
  }
];
const config = {
  production: "https://playcranberry.co/node",
  development:
    "https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=451ea61711c4409aaa12fb9394d008b8"
};
const variables = {
  production: {
    keyterpillar: {
      abi: keyterpillarAbi,
      address:
        "0xa04ec2d89aab8dbc4228572251e151956ad3529f830b26a9bcb64356532e676d" //todo deploy to prod
    }
  },
  development: {
    keyterpillar: {
      abi: keyterpillarAbi,
      address:
        "0xa04ec2d89aab8dbc4228572251e151956ad3529f830b26a9bcb64356532e676d"
    }
  }
};
//this config is toggled buy url params
export const defaultProvider = config.production;
export const productionProvider = config.production;
export const developmentProvider = config.development;

//this config depends onf the build environment
export const KeyterpillarContract = variables[env].keyterpillar;
