import { Container } from "@mui/material"
import { useEthers } from "@usedapp/core"
import { constants } from "ethers"
import brownie_config from "../chain_info/brownie-config.json"
import helper_config from "../chain_info/helper_config.json"
import deployment_map from "../chain_info/build/deployments/map.json"
import { YourWallet } from "./Wallet/YourWallet"
import { Farm } from "./TokenFarm/Farm"


export type Token = {
    name: string,
    address: string,
    image: string
}


export const Main = () => {
    const { chainId } = useEthers();
    const network_name = chainId ? helper_config[String(chainId)] : "dev"
    const dapp_token_address = chainId ? deployment_map[String(chainId)]["FarmToken"][0] : constants.AddressZero
    const weth_token_address = chainId ? brownie_config["networks"][network_name]["weth_token"] : constants.AddressZero
    const dai_token_address = chainId ? brownie_config["networks"][network_name]["dai_token"] : constants.AddressZero
    const supportedTokens: Array<Token> = [
        {
            name: "DAPP",
            address: dapp_token_address,
            image: ""
        },
        {
            name: "WETH",
            address: weth_token_address,
            image: ""
        },
        {
            name: "DAI",
            address: dai_token_address,
            image: ""
        }
    ]
    return (
        <Container maxWidth="lg">
            <YourWallet supportedTokens={supportedTokens} />
            <Farm supportedTokens={supportedTokens} />
        </Container >)
}