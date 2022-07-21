import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from "next/router";
import Web3Modal from 'web3modal';
import { marketplaceAddress } from '../config';

//for setting uris
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const NFTContract = require('../artifacts/contracts/NFTMarket.sol/RoyalNFTPark.json');

export default function CreateNFT(){
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
  const router = useRouter();

  //uploading the image to ipfs
  async function onChange(e) {
    
    const file = e.target.files[0]
    try {
      const addFile = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      ) 
      console.log('addFile>>>>>>>>>>', addFile)
      //addFile.path, the path given to us after uploading
      const url = `https://ipfs.infura.io/ipfs/${addFile.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('error uploading file >>>>>>>>>>>>>', error)
    }
  }

  async function uploadToIPFS(){
    //destructuring from forminput
    const { price, name, description } = formInput;
    if(!name || !description || !price || !fileUrl) return 
    const nftData = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const addFile = await client.add(nftData);
      console.log('new add file>>>>>>>>>>>>>>', addFile)
      const url = `https://ipfs.infura.io/ipfs/${addFile.path}`;
      return url;
    } catch (error) {
      console.log('error while creating item >>>>>>>>>>>>>', error);
    }
  }

  async function createSale(){
    const url = await uploadToIPFS()
    //ethereum being injected into web-browser
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect();
    //creating provider using that connection, for signing and using that connection
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(marketplaceAddress, NFTContract.abi, signer);
    const price = ethers.utils.parseUnits(formInput.price, 'ether');
    let listingPrice = await nftContract.getListingPrice()
    listingPrice = listingPrice.toString()
    const createToken = await nftContract.createNFT(url, price, { value: listingPrice });
    await createToken.wait();
    console.log('Token created>>>>>>>>>', createToken)
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          //preview of the file
          //if there is a file url then show the image
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createSale} className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )

}



