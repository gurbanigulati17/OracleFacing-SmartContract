import React, { useState, useEffect } from 'react'
import {TextField , Button } from '@mui/material';
import './App.css'
import { OracleFacingGeoConsumerAddress } from './config.js'
import { LinkTokenAddress } from './config.js'
import { ethers } from 'ethers'
import OracleFacingGeoConsumerAbi from './utils/OracleFacingGeoConsumer.json'
import LinkTokenAbi from './utils/LinkToken.json'
import LatestCid from './LatestCid'

function App() {
  const [latestCids, setLatestCids] = useState([])
  const [numberOfLinks, setNumberOfLinks] = useState(0)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [balance, setBalance] = useState('')

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)

      const polygonMaticChainId = '0x13881'

      if (chainId !== polygonMaticChainId) {
        alert('You are not connected to the Polygon Testnet!')
        return
      } else {
        setCorrectNetwork(true)
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  const getLatestCid = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const OracleFacingGeoConsumer = new ethers.Contract(
          OracleFacingGeoConsumerAddress,
          OracleFacingGeoConsumerAbi.abi,
          signer,
        )

        let total_oracle_calls = await OracleFacingGeoConsumer.total_oracle_calls()
        console.log(total_oracle_calls)

        var latestCid
        if (total_oracle_calls === 0) {
          latestCid = 0
          console.log('No oracle call has been made yet.')
        } else {
          latestCid = await OracleFacingGeoConsumer.getCid(
            total_oracle_calls - 1,
          )
          console.log('Latest cid is ', latestCid)
        }

        setLatestCids(latestCid)
      } else {
        console.log("ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fundLink = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const LinkToken = new ethers.Contract(
          LinkTokenAddress,
          LinkTokenAbi.abi,
          signer,
        )

        const balanceHex = await LinkToken.balanceOf(
          OracleFacingGeoConsumerAddress,
        )
        let amount = await ethers.BigNumber.from(balanceHex._hex).toString()
        setBalance(amount)
        console.log(
          'LINK balance of contract: ' +
            OracleFacingGeoConsumerAddress +
            ' is ' +
            balance / Math.pow(10, 18),
        )
        setBalance(balance)

        // setNumberOfLinks(1)
        console.log('Link to add: ' + numberOfLinks)
        const tx = await LinkToken.transfer(
          OracleFacingGeoConsumerAddress,
          (numberOfLinks * Math.pow(10, 18)).toString(),
        )
        console.log(tx.hash)
      } else {
        console.log("ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    //getLatestCid()
  }, [])

  return (
    <div>
      {currentAccount === '' ? (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div className="App">
        <h2> Oracle Facing GeoConsumer App </h2>
        <form>
           <TextField id="outlined-basic" label="Fund Link" variant="outlined" style={{margin:"0px 5px"}} size="small" value={numberOfLinks}
           onChange={e=>setNumberOfLinks(e.target.value)} />
          <Button variant="contained" color="primary" onClick={fundLink}  >Fund Contract</Button>
          <TextField id="outlined-basic" label="CID" variant="outlined" style={{margin:"0px 5px"}} size="small" value={latestCids} readOnly={true} 
           onChange={e=>setLatestCids(e.target.value)} />
          <Button variant="contained" color="primary" onClick={getLatestCid}  >Get Latest CID</Button>
         
          
        </form>
        
       
      </div>
        
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  )
}

export default App
