class ContractRegistry {
    constructor() {
        this.contracts = []
    }
    addContract(contract) {
        this.contracts.push(contract)
    }
}
let globalTokenContractRegistry = new ContractRegistry();
module.exports = globalTokenContractRegistry;