//SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/contracts/interfaces/IPool.sol";

contract FarmDapp is Ownable {
    address[] public allowedTokens;
    address[] public stakers;
    mapping(address => mapping(address => uint256)) public stakedTokensAmount;
    mapping(address => uint256) public uniqueTokensStaked;
    address poolAddress;
    IERC20 public dappToken;
    IPool public aavePool;

    //stake tokens DONE
    //unstake tokens DONE
    //allowed tokens DONE
    //issue reward tokens
    constructor(address _dappTokenAddress, address _poolAddress) {
        poolAddress = _poolAddress;
        dappToken = IERC20(_dappTokenAddress);
        aavePool = IPool(_poolAddress);
    }

    function stakeToken(address _token, uint256 _amount) public {
        require(isAllowedToken(_token), "Token currently not supported");
        require(_amount > 0, "Amount must be greater than 0");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        uint256 tokenAmount = stakedTokensAmount[_token][msg.sender];
        if (tokenAmount <= 0) {
            uniqueTokensStaked[msg.sender] += 1;
        }
        stakedTokensAmount[_token][msg.sender] = tokenAmount + _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
        aaveStake(_token, _amount);
    }

    function unstakeToken(address _token) public {
        require(
            stakedTokensAmount[_token][msg.sender] > 0,
            "You have not staked this token"
        );
        require(isAllowedToken(_token), "Unavailable token");
        withdrawFromAave(_token, msg.sender);
        IERC20(_token).transfer(
            msg.sender,
            stakedTokensAmount[_token][msg.sender]
        );
        stakedTokensAmount[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] -= 1;
        if (uniqueTokensStaked[msg.sender] == 0) {
            address _staker = msg.sender;
            removeStaker(_staker);
        }
    }

    function removeStaker(address _staker) internal {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (_staker == stakers[i]) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
            }
        }
    }

    function isAllowedToken(address _token) internal view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (_token == allowedTokens[i]) {
                return true;
            }
        }
        return false;
    }

    function allowToken(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function aaveStake(address _asset, uint256 _amount) internal {
        IERC20(_asset).approve(poolAddress, _amount);
        aavePool.supply(_asset, _amount, address(this), 0);
    }

    function getLiquidityRate(address _asset) public view returns (uint128) {
        uint128 currentLiquidityRate = aavePool
            .getReserveData(_asset)
            .currentLiquidityRate;
        return currentLiquidityRate;
    }

    function withdrawFromAave(address _asset, address _to) internal {
        uint256 amount = stakedTokensAmount[_asset][_to];
        aavePool.withdraw(_asset, amount, _to);
    }
}
