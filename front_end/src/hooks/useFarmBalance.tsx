import { useCall, useEthers } from "@usedapp/core"
import deployment_map from "../chain_info/build/deployments/map.json"
import TokenFarm from "../chain_info/build/contracts/FarmDapp.json"
import { constants, Contract } from "ethers"

export const useFarmBalance = (ERC20address: string) => {
    const { account, chainId } = useEthers()
    const farmContractAddress = chainId ? deployment_map[String(chainId)]["FarmDapp"][0] : constants.AddressZero
    const farmContractABI = TokenFarm.abi
    const { value, error } = useCall({
        contract: new Contract(farmContractAddress, farmContractABI),
        method: "stakedTokensAmount",
        args: [ERC20address, account]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    } return { value, error }
}