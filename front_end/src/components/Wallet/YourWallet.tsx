import React, { useState } from "react"
import { Token } from "../Main"
import { Box, Tab } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { WalletBalance } from "./WalletBalance"

export interface YourWalletProps {
    supportedTokens: Array<Token>
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const [tokenIndex, setTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setTokenIndex(parseInt(newValue))
    }
    return (
        <Box>
            <h1>Your Wallet</h1>
            <Box>
                <TabContext value={tokenIndex.toString()}>
                    <TabList onChange={handleChange}>
                        {supportedTokens.map((token, index) => {
                            return (<Tab label={token.name} value={index.toString()} key={index}></Tab>)
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <WalletBalance selectedToken={token} />
                            </TabPanel>
                        )

                    })}
                </TabContext>
            </Box>
        </Box>
    )
}