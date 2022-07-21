import '../styles/globals.css'
import Link from 'next/link'
// import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"

function MyApp({ Component, pageProps }) {
  // const image1 = 'https://img.buzzfeed.com/buzzfeed-static/static/2022-02/4/16/asset/c0ed6941e481/sub-buzz-10292-1643993693-18.jpg?downsize=1040:*&output-format=auto&output-quality=auto'
  // const image2 = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/queen-elizabeth-ii-and-prince-philip-on-the-balcony-of-news-photo-1652904886.jpg?crop=1xw:1xh;center,top&resize=980:*'
  // const image3 = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/camilla-duchess-of-cornwall-prince-charles-prince-of-wales-news-photo-1652908109.jpg?crop=1xw:1xh;center,top&resize=980:*'
  // const image4 = 'https://theafricanmirror.africa/wp-content/uploads/Queen-Elizabeth-Platinum-Jubilee-800x445.jpg'

  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Royal Windsor NFT Park</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-purple-500">Home</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-purple-500">Sell NFT</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-purple-500">My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-purple-500">Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
      {/* <div>
        <AliceCarousel autoPlay autoPlayInterval="3000">
          <img src={image1} className="sliderimg" />
          <img src={image2} className="sliderimg" />
          <img src={image3} className="sliderimg" />
          <img src={image4} className="sliderimg" />
        </AliceCarousel>
      </div> */}
    </div>
  )
}

export default MyApp
