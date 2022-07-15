import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import './App.css'
import { OracleFacingGeoConsumerAddress } from './config.js'
import { LinkTokenAddress } from './config.js'
import { ethers } from 'ethers'
import OracleFacingGeoConsumerAbi from './utils/OracleFacingGeoConsumer.json'
import LinkTokenAbi from './utils/LinkToken.json'
//import LatestCid from './LatestCid'

function App() {
  const [latestCids, setLatestCids] = useState([])
  const [latestData, setLatestData] = useState('')
  const [numberOfLinks, setNumberOfLinks] = useState(0)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [balance, setBalance] = useState(0)

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

  const getLatestData = async () => {
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

        let latestData = await OracleFacingGeoConsumer.getGeostatsData()
        console.log(latestData)

        if (latestData === 0) {
          console.log(
            'Either no oracle call has been made yet or the data returned is 0',
          )
        } else {
          console.log('Latest data is ', parseInt(latestData))
        }

        setLatestData(latestData)
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

  const sendRequest = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        // const LinkToken = new ethers.Contract(
        //   LinkTokenAddress,
        //   LinkTokenAbi.abi,
        //   signer,
        // )

        // const balanceHex = await LinkToken.balanceOf(
        //   OracleFacingGeoConsumerAddress,
        // )
        // console.log('Balance hex' + balanceHex)
        // const amount = (ethers.BigNumber.from(balanceHex).toBigInt()) / 1000000000000000000n;
        // console.log('Amount ' + amount)

        //setBalance(amount);

        console.log(
          'LINK balance of contract: ' +
            OracleFacingGeoConsumerAddress +
            ' is ' +
            balance,
        )

        if (balance < 1) {
          console.log(
            'Please fund the contract at ' +
              OracleFacingGeoConsumerAddress +
              ' with 1 LINK per Oracle call',
          )
        } else {
          const agg_x = 'agg_mean'
          const dataset_code = 'COPERNICUS/S2_SR'
          const selected_band = 'NDVI'
          const image_scale = 250
          const start_date = '2021-09-01'
          const end_date = '2021-09-10'
          const geometry =
            '[[1,[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]]]'

          console.log(
            agg_x,
            dataset_code,
            selected_band,
            image_scale,
            start_date,
            end_date,
            geometry,
          )

          var geometry_array = JSON.parse(geometry)
          for (var i = 0; i < geometry_array.length; i++) {
            geometry_array[i][1] = JSON.stringify(geometry_array[i][1])
          }

          const OracleFacingGeoConsumer = new ethers.Contract(
            OracleFacingGeoConsumerAddress,
            OracleFacingGeoConsumerAbi.abi,
            signer,
          )

          await OracleFacingGeoConsumer.requestGeostatsData(
            agg_x,
            dataset_code,
            selected_band,
            image_scale,
            start_date,
            end_date,
            geometry_array,
          )
        }
      } else {
        console.log("ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkBalance = async () => {
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
        console.log('Balance hex' + balanceHex)
        const amount =
          ethers.BigNumber.from(balanceHex).toBigInt() / 1000000000000000000n
        console.log('Amount ' + amount)

        setBalance(amount)
      } else {
        console.log("ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    //getLatestCid()
    connectWallet()
    checkBalance()
  }, [])

  return (
    <div>
      {currentAccount === '' ? (
        <div className="App">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <form>
            <Button variant="contained" color="primary" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </form>
        </div>
      ) : correctNetwork ? (
        <div className="App">
          <h2> Oracle Facing GeoConsumer App </h2>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <form>
            <TextField
              id="outlined-basic"
              label="Fund Link"
              variant="outlined"
              style={{ margin: '0px 5px' }}
              size="small"
              value={numberOfLinks}
              onChange={(e) => setNumberOfLinks(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={fundLink}>
              Fund Contract
            </Button>
            <TextField
              id="outlined-basic"
              label="CID"
              variant="outlined"
              style={{ margin: '0px 5px' }}
              size="small"
              value={latestCids}
              readOnly={true}
              onChange={(e) => setLatestCids(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={getLatestCid}>
              Get Latest CID
            </Button>
            <TextField
              id="outlined-basic"
              label="Data"
              variant="outlined"
              style={{ margin: '0px 5px' }}
              size="small"
              value={latestData}
              readOnly={true}
              onChange={(e) => setLatestData(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={getLatestData}>
              Get Latest Data
            </Button>
          </form>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div>
            {balance ? (
              <Button variant="contained" color="primary" onClick={sendRequest}>
                Send Request
              </Button>
            ) : (
              <h4 style={{ color: 'red' }}>
                Insufficient balance. Please fund the contract at{' '}
                {OracleFacingGeoConsumerAddress} with 1 LINK per Oracle call
              </h4>
            )}
          </div>
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
