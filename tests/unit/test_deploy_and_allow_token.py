from scripts.helpers import get_account
from scripts.deploy import deploy
from brownie import exceptions

import pytest

amount = 100


def test_deploy_and_allow_token():
    # Arrange
    account = get_account()
    non_owner = get_account(1)
    token, farm = deploy()
    token_address = token.address
    # Act
    allow_tx = farm.allowToken(token_address, {"from": account})
    # Assert
    assert token_address == farm.allowedTokens(0)
    with pytest.raises(exceptions.VirtualMachineError):
        farm.allowToken(token_address, {"from": non_owner})


def test_stake():
    # Arrange
    account = get_account()
    token, farm = deploy()
    # Act
    token.approve(farm.address, amount, {"from": account})
    farm.stakeToken(token.address, amount, {"from": account})
    # Assert
    assert farm.stakedTokensAmount(token.address, account) == amount
    assert farm.uniqueTokensStaked(account) == 1
    assert farm.stakers(0) == account
    return token, farm


def test_unstake():
    # Arrange
    account = get_account()
    dapp_token, farm = test_stake()
    # Act
    tx = farm.unstakeToken(dapp_token.address, {"from": account})
    # Assert
    assert farm.stakedTokensAmount(dapp_token.address, account) == 0
    assert farm.uniqueTokensStaked(account) == 0
    with pytest.raises(exceptions.VirtualMachineError):
        farm.stakers(0)
