from scripts.helpers import get_account, get_contract, update_frontend, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from brownie import FarmToken, FarmDapp, config, network, interface


def deploy():
    account = get_account()
    dapp_token = FarmToken.deploy({"from": account})
    token_address = dapp_token.address
    pool_addresses_provider = interface.IPoolAddressesProvider(
        config["networks"][network.show_active()]["pool_addresses_provider"])
    pool_address = pool_addresses_provider.getPool()
    farm = FarmDapp.deploy(token_address, pool_address, {
                           "from": account}, publish_source=config["networks"][network.show_active()]["verify"])
    allowed_tokens_dict = {
        "dapp_token": token_address,
        "weth_token": get_contract("weth_token"),
        "dai_token": get_contract("dai_token")
    }
    add_allowed_tokens(farm, allowed_tokens_dict, account)
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        update_frontend()
    return dapp_token, farm


def add_allowed_tokens(token_farm, allowed_tokens_dict, account):
    for token in allowed_tokens_dict:
        tx = token_farm.allowToken(
            allowed_tokens_dict[token], {"from": account})
    return token_farm


def main():
    deploy()
