import { useContractFunction, useEthers, useTokenBalance } from "@usedapp/core"
import { constants, Contract, utils } from "ethers"
import deployment_map from "../chain_info/build/deployments/map.json"
import TokenFarm from "../chain_info/build/contracts/FarmDapp.json"
import ERC20 from "../chain_info/build/contracts/MockDAI.json"
import { useEffect, useState } from "react"

export const useStake = (ERC20address: string) => {
    const { chainId } = useEthers()
    const farmContractAddress = chainId ? deployment_map[String(chainId)]["FarmDapp"][0] : constants.AddressZero
    const farmContractABI = TokenFarm.abi
    const farmContractInterface = new utils.Interface(farmContractABI)
    const farmContract = new Contract(farmContractAddress, farmContractInterface)

    const ERC20abi = ERC20.abi
    const ERC20Interface = new utils.Interface(ERC20abi)
    const ERC20contract = new Contract(ERC20address, ERC20Interface)
    const [amountToStake, setAmountToStake] = useState("0")
    //Approve
    const { state: approveERC20State, send: approveERC20Send } = useContractFunction(ERC20contract, "approve", { transactionName: "Approve ERC20 token transfer" })
    const approve = (amount: string) => {
        setAmountToStake(amount)
        console.log(approveERC20State.status)
        return approveERC20Send(farmContractAddress, amount)
    }
    //Stake
    const { state: stakeState, send: stakeSend } = useContractFunction(farmContract, "stakeToken", { transactionName: "Stake ERC20 token" })
    useEffect(() => {
        if (approveERC20State.status === "Success") {
            console.log("Approved")
            console.log("Staking....")
            stakeSend(ERC20address, amountToStake)
            console.log("staked")
        }
    }, [approveERC20State, amountToStake, ERC20address])
    const [state, setState] = useState(approveERC20State)
    useEffect(() => {
        if (approveERC20State.status === "Success") {
            setState(stakeState)
        } else {
            setState(approveERC20State)
        }
    }, [approveERC20State, stakeState])

    return { approve, state }
}