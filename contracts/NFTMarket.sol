// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RoyalNFTPark is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Counters.Counter private _tokenSold;

  address payable owner;
  uint256 listingPrice = 0.025 ether;

  constructor() ERC721("RoyalNFT", "RNFT") {
    //owner will deploy
    owner = payable(msg.sender);
  }

  struct NFT {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  event NFTWhichIsCreated (
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  mapping(uint256 => NFT) private IDgiventoMarketItem;

  function createNFT(string memory tokenURI, uint256 price) public payable returns (uint) {
    _tokenIds.increment();
    uint currentTokenId = _tokenIds.current();
    _mint(msg.sender, currentTokenId);
    _setTokenURI(currentTokenId, tokenURI);
    //along with minting, calling createMarket()
    createMarketItem(currentTokenId, price);
    return currentTokenId;
  }

  function getListingPrice() public view returns (uint256){
    return listingPrice;
  }

  function createMarketItem(uint256 tokenId, uint256 price) private {
    require(price > 0, "price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");
    IDgiventoMarketItem[tokenId] = NFT(tokenId, payable(msg.sender), payable(address(this)), price, false);
    //transfer the ownership of the item to this contract
    _transfer(msg.sender, address(this), tokenId);
    emit NFTWhichIsCreated(tokenId, msg.sender, address(this), price, false);
  }

  function createMarketSale(uint256 tokenId) public payable {
    uint price = IDgiventoMarketItem[tokenId].price;
    address seller = IDgiventoMarketItem[tokenId].seller;
    //now the buyer is owner
    IDgiventoMarketItem[tokenId].owner = payable(msg.sender);
    IDgiventoMarketItem[tokenId].sold = true;
    IDgiventoMarketItem[tokenId].seller = payable(address(0));
    _tokenSold.increment();
    _transfer(address(this), msg.sender, tokenId);
    //paying the owner of the contract
    payable(owner).transfer(listingPrice);
    payable(seller).transfer(msg.value);
  }
  //fetch all the unsold nfts and return them
  function fetchMarketItems() public view returns (NFT[] memory){
    uint allItemCount = _tokenIds.current();
    uint unsoldItemCount = _tokenIds.current() - _tokenSold.current();
    uint currentIndex = 0;
    NFT[] memory items = new NFT[](unsoldItemCount);
    for(uint i=0; i < allItemCount; i++){
      //this contract is owner so, unsold
      if(IDgiventoMarketItem[i+1].owner == address(this)){
        uint currentId = i + 1;
        //reference to current item
        NFT storage currentItem = IDgiventoMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function getUserNFTs() public view returns (NFT[] memory) {
    uint allItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    //checking if the user(msg.sender) is owner so, make a count of that
    for (uint i = 0; i < allItemCount; i++) {
      if (IDgiventoMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }
    //and then use that 'count' to make a new array of user specific nfts and return them
    NFT[] memory items = new NFT[](itemCount);
    for (uint i = 0; i < allItemCount; i++) {
      if (IDgiventoMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        //reference to current item
        NFT storage currentItem = IDgiventoMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //that users have created themselves
  function fetchItemsListed() public view returns (NFT[] memory) {
    uint allItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    //check if the seller is msg.sender, this means user itself created nft and not the owner
    for (uint i = 0; i < allItemCount; i++) {
      if (IDgiventoMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }
    //returning them
    NFT[] memory items = new NFT[](itemCount);
    for (uint i = 0; i < allItemCount; i++) {
      if (IDgiventoMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        //reference to current item
        NFT storage currentItem = IDgiventoMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

}