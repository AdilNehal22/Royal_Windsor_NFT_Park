import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { marketplaceAddress } from '../config';
const NFTContract = require('../artifacts/contracts/NFTMarket.sol/RoyalNFTPark.json');

export default function Dashboard(){
  const[NFTS, setNfts] = useState([]);
  const[soldNFTS, setSoldNFTS] = useState([]);
  const [loading, setLoading] = useState('not-loaded');


  useEffect(()=>{
    loadNFTs()
  }, [])
  async function loadNFTs(){
    //ethereum being injected into web-browser
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect();
    //creating provider using that connection, for signing and using that connection
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(marketplaceAddress, NFTContract.abi, signer);
    const nfts = await nftContract.fetchItemsListed();
    const allNFTS = await Promise.all(nfts.map((async i => {
      console.log('i.price>>>>>>>>>', i.price.toString())
      const tokenURI = await nftContract.tokenURI(i.tokenId);
      console.log('tokenURI>>>>>>>>>>>', tokenURI)
      const metaData = await axios.get(tokenURI);
      console.log('metaData>>>>>>>>>', metaData)
      let nftPrice = await ethers.utils.formatUnits(i.price.toString(), 'ether');
      let splittedNFTPrice = nftPrice.split('.')[0]
      console.log('nft price', splittedNFTPrice)
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
    const soldedNFTS = await allNFTS.filter(i => i.sold);
    setNfts(allNFTS);
    console.log('NFTS>>>>>>>>>>>>>', NFTS)
    setSoldNFTS(soldedNFTS);
    setLoading('loaded')
  }
  return(
    <div>
      <div className='px-4' style={{ maxWidth: '600px' }}>
        <h2 className='text-2xl py-2'> NFTS Created </h2>
          <div className='grid grid-cols-1 sm:grid-clos2 lg:grid-col-4 gap-4 pt-4'>
            {
              NFTS.map((item, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={item.image} />
                  <div className="p-4">
                    <p style={{ height: '64px' }} className="text-2xl font-semibold">{item.name}</p>
                    <div style={{ height: '70px', overflow: 'hidden' }}>
                      <p className="text-black-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">{item.splittedNFTPrice} ETH</p>
                  </div>
                </div>
              ))
            }
      </div>
      <div className='px-4'>
        {
          Boolean(soldNFTS.length) && (
            <div>
              <h2 className='text-2xl py-2'> NFTS Sold</h2>
              <div className='grid grid-cols-1 sm:grid-clos2 lg:grid-col-4 gap-4 pt-4'>
                {
                  soldNFTS.map((item, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={item.image} className='rounded' />
                      <div className='p-4 bg-black'>
                        <p className='text-2xl font-bold text-white'> Price - {item.splittedNFTPrice} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
    </div>
  )
}