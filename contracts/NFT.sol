// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@zetachain/toolkit/contracts/BytesHelperLib.sol";
import "@zetachain/toolkit/contracts/OnlySystem.sol";

contract NFT is zContract, ERC721, OnlySystem {
    SystemContract public systemContract;
    error  CallerNotOwnerNotApproved();
    uint256 constant BITCOIN = 18332;


    mapping(uint256 => uint256) public tokenAmounts;
    mapping(uint256 => uint256) public tokenChains;

    uint256 private _nextTokenId;


    constructor(address systemContractAddress)  ERC721("MYNFT", "MNFT"){
        systemContract = SystemContract(systemContractAddress);
        _nextTokenId = 0;
    }

    function onCrossChainCall(
        zContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external override onlySystem(systemContract) {
        address recipient;
        
        if (context.chainID == BITCOIN) {
            recipient = BytesHelperLib.bytesToAddress(message, 0);
        }
        else {
            recipient = abi.decode(message, (address));
        }
        _mintNFT(recipient, context.chainID, amount);
    }
}
