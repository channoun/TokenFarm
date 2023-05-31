import { useContractFunction, useEthers } from "@usedapp/core"
import { constants, Contract, utils } from "ethers"
import deployment_map from "../chain_info/build/deployments/map.json"
import TokenFarm from "../chain_info/build/contracts/FarmDapp.json"


export const useUnstake = () => {
    const { chainId } = useEthers()
    const farmContractAddress = chainId ? deployment_map[String(chainId)]["FarmDapp"][0] : constants.AddressZero
    const farmContractABI = TokenFarm.abi
    const farmContractInterface = new utils.Interface(farmContractABI)
    const farmContract = new Contract(farmContractAddress, farmContractInterface)

    return useContractFunction(farmContract, "unstakeToken", { transactionName: "Unstake Token Balance" })
}