import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Token } from "../Main"
import { StakeForm } from "./StakeForm"

export interface WalletBalanceProps {
    selectedToken: Token
}

export const WalletBalance = ({ selectedToken }: WalletBalanceProps) => {
    const { account } = useEthers()
    const { name, address } = selectedToken
    const balance = useTokenBalance(address, account)
    const parsedBalance = balance !== undefined ? parseFloat(formatUnits(balance, 18)) : 0
    const isConnected = account !== undefined && account !== null
    return (
        <>
            {isConnected ? (
                <>
                    <h2>You have {`${parsedBalance} ${name}`} tokens</h2>
                    <StakeForm stakedToken={selectedToken} balance={parsedBalance} />
                </>
            ) : (
                <h2>Please connect your wallet</h2>
            )}
        </>
    )
}