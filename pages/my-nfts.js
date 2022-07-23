import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { marketplaceAddress } from '../config';
const NFTContract = require('../artifacts/contracts/NFTMarket.sol/RoyalNFTPark.json');

export default function MyOwnNFTS(){
  const[assets, setMyAssets] = useState([]);
  const[loading, setLoading] = useState('not-loaded');

  useEffect(()=>{
    loadAssets()
  }, []);

  async function loadAssets(){
    //ethereum being injected into web-browser
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect();
    //creating provider using that connection, for signing and using that connection
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(marketplaceAddress, NFTContract.abi, signer);
    const nfts = await nftContract.getUserNFTs();
    const allNFTS = await Promise.all(nfts.map((async i => {
      const tokenURI = await nftContract.tokenURI(i.tokenId);
      console.log('tokenURI>>>>>>>>>>>', tokenURI)
      const metaData = await axios.get(tokenURI);
      console.log('metaData>>>>>>>>>', metaData)
      let nftPrice = await ethers.utils.formatUnits(i.price.toString(), 'ether');
      let splittedNFTPrice = nftPrice.split('.')[0]
      let nftItem = {
        splittedNFTPrice,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: metaData.data.image,
        name: metaData.data.name,
        description: metaData.data.description
      }
      return nftItem
    })))
    setMyAssets(allNFTS)
    console.log(assets)
    setLoading('loaded')
  }

  if (loading === "loaded" && !assets.length) return (
    <h1 className="px-20 py-10 text-3xl">That is kinda sad, you never showed love to your Queen</h1>
  )
  return(
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            assets.map((item, i)=>(
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={item.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {item.splittedNFTPrice} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}


