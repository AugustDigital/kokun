class ContractRegistry {
    constructor() {
        this.contracts = []
        this.account = null;
    }
    addContract(contract) {
        this.contracts.push(contract)
    }
}
let globalTokenContractRegistry = new ContractRegistry();
module.exports = globalTokenContractRegistry;