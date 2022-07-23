import { ethers } from 'ethers'
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { marketplaceAddress } from '../config'
import { image1, image2, image3, image4 } from '../public/imageSource'

const NFTContract = require('../artifacts/contracts/NFTMarket.sol/RoyalNFTPark.json');

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')

  //call this function when the app/component loads
  useEffect(()=>{
    loadNFTs()
  }, [])

  async function loadNFTs(){
    //we don't need to know about users so using very generic provider
    const provider = new ethers.providers.JsonRpcProvider();
    const nftContract = new ethers.Contract(marketplaceAddress, NFTContract.abi, provider);
    const nfts = await nftContract.fetchMarketItems();
    const allNFTS = await Promise.all(nfts.map((async i => {
      const tokenURI = await nftContract.tokenURI(i.tokenId);
      console.log('tokenURI>>>>>>>>>>>', tokenURI)
      const metaData = await axios.get(tokenURI);
      console.log('metaData>>>>>>>>>', metaData)
      let nftPrice = await ethers.utils.formatUnits(i.price.toString(), 'ether');
      const splittedValue = nftPrice.split('.')[0];
      let nftItem = {
        splittedValue,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: metaData.data.image,
        name: metaData.data.name,
        description: metaData.data.description
      }
      return nftItem
    })))
    console.log('all nfts>>>>>>>>>>>>', allNFTS)
    setNfts(allNFTS)
    setLoaded('loaded')
  }

  async function purchaseNFT(nft){
    console.log(nft)
    //ethereum being injected into web-browser
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect();
    //creating provider using that connection, for signing and using that connection
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(marketplaceAddress, NFTContract.abi, signer);
    // let nftPrice = ethers.utils.formatUnits(nft.nftPrice, 'ether');
    let nftPrice = nft.nftPrice
    // console.log('splittedNFT price', nftPrice)
    //create market sale
    const createSale = await nftContract.createMarketSale(nft.tokenId, { value: nftPrice });
    await createSale.wait();
    //calling load nfts again because we don't want to show the purchased nft
    loadNFTs();
  }

  function renderSlider(){
    return(
      <div className='header'>
        <AliceCarousel autoPlay autoPlayInterval="3000">
          <img src={image1} className="sliderimg" height='100px' width='100%' />
          <img src={image2} className="sliderimg" height='100px' width='100%' />
          <img src={image3} className="sliderimg" height='100px' width='100%' />
          <img src={image4} className="sliderimg" height='100px' width='100%' />
        </AliceCarousel>
      </div> 
    )
  }

  if (loaded === 'loaded' && !nfts.length) return (
    <div>
      {renderSlider()}
      <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
    </div>
  )

  return (
    <div className="flex justify-center">
      <div className='px-4' style={{maxWidth: '1600px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {renderSlider()}
          {
            nfts.map((item, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={item.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{item.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-black-400">{item.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{item.splittedValue} ETH</p>
                  <button className="mt-4 w-full bg-purple-500 text-white font-bold py-2 px-12 rounded" onClick={() => purchaseNFT(item)}>Purchase</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
