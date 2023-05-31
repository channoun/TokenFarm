from brownie import accounts, network, config, MockDAI, MockWETH, Contract
import yaml
import os
import json
import shutil

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]
FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]


contract_to_mock = {"weth_token": MockWETH,
                    "dai_token": MockDAI}


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS or network.show_active() in FORKED_LOCAL_ENVIRONMENTS:
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def get_contract(contract_name):
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        return contract_type[-1]
    try:
        contract_address = config["networks"][network.show_active(
        )][contract_name]
        contract = Contract.from_abi(
            contract_type.abi[0]["name"], contract_address, contract_type.abi)
        return contract
    except:
        print(
            f"{network.show_active()} address not found for {contract_name}. Perhaps you should add it to the config.")


def deploy_mocks():
    account = get_account()
    mockDAI = MockDAI.deploy({"from": account})
    print(f"Mock DAI token deployed to {mockDAI.address} !")
    mockWETH = MockWETH.deploy({"from": account})
    print(f"Mock WETH token deployed to {mockWETH.address} !")


def update_frontend():
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
    with open("./front_end/src/chain_info/brownie-config.json", "w") as json_config:
        json.dump(config_dict, json_config)
    src = "./build/"
    dest = "./front_end/src/chain_info/build"
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    update_frontend()
