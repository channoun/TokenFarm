import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Tab } from "@mui/material"
import React, { useState } from "react"
import { YourWalletProps } from "../Wallet/YourWallet"
import { FarmBalance } from "./FarmBalance"

export const Farm = ({ supportedTokens }: YourWalletProps) => {
    const [tokenIndex, setTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newIndex: string) => {
        setTokenIndex(parseInt(newIndex))
    }
    return (
        <Box>
            <h1>Token Farm</h1>
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
                                <FarmBalance selectedToken={token} />
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>
    )
}