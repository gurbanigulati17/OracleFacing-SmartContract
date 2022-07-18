import React, { useState, useEffect } from 'react'
import './App.css'
import { OracleFacingGeoConsumerAddress } from './config.js'
import { LinkTokenAddress } from './config.js'
import { ethers } from 'ethers'
import OracleFacingGeoConsumerAbi from './utils/OracleFacingGeoConsumer.json'
import LinkTokenAbi from './utils/LinkToken.json'

// Style components
import { TextField, Button, Divider } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'

function App() {
  const [latestCids, setLatestCids] = useState([])
  const [latestData, setLatestData] = useState('')
  const [numberOfLinks, setNumberOfLinks] = useState(0)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [balance, setBalance] = useState(0)

  const [selected, setSelected] = useState('')
  const [selectedDataset, setSelectedDataset] = useState('')
  const [selectedAvailableBands, setSelectedAvailableBands] = useState('')
  const [selectedStatistics, setSelectedStatistics] = useState('')
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')

  const [preferredScale, setPreferredScale] = useState(0)
  const [geometryArea, setGeometryArea] = useState([])
  const [polygonDimensions, setPolygonDimensions] = useState(0)
  const [geometryValue, setGeometryValue] = useState()
  const [geometryArray, setGeometryArray] = useState([])

  const [count, setCount] = useState(0)
  //const [geometry_global, setGeometryGlobal] = useState([])

  // GeoConsumer Fields

  const GeostatisticsDataset = [
    'WAPOR Actual Evapotranspiration and Interception',
    'WAPOR Daily Reference Evapotranspiration',
    'MOD16A2.006: Terra Net Evapotranspiration 8-Day Global 500m',
    'Sentinel-2 MSI: MultiSpectral Instrument, Level-2A - Computed NDVI',
    'PERSIANN-CDR: Precipitation Estimation From Remotely Sensed Information Using Artificial Neural Networks-Climate Data Record',
    'CHIRPS Daily: Climate Hazards Group InfraRed Precipitation With Station Data (Version 2.0 Final)',
    'GSMaP Operational: Global Satellite Mapping of Precipitation',
    'NASA-USDA Enhanced SMAP Global Soil Moisture Data',
    'MOD11A1.006 Terra Land Surface Temperature and Emissivity Daily Global 1km',
    'MYD11A1.006 Aqua Land Surface Temperature and Emissivity Daily Global 1km',
    'MCD15A3H.006 MODIS Leaf Area Index/FPAR 4-Day Global 500m',
    'MOD13Q1.006 Terra Vegetation Indices 16-Day Global 250m',
    'MYD13Q1.006 Aqua Vegetation Indices 16-Day Global 250m',
    'MYD15A2H.006: Aqua Leaf Area Index/FPAR 8-Day Global 500m',
    'VNP13A1: VIIRS Vegetation Indices 16-Day 500m',
  ]

  const GeostatisticsAvailableBands00 = ['L1_AETI_D']
  const GeostatisticsAvailableBands01 = ['L1_RET_E']
  const GeostatisticsAvailableBands02 = ['ET']
  const GeostatisticsAvailableBands03 = ['NDVI', 'EVI']
  const GeostatisticsAvailableBands04 = ['precipitation']
  const GeostatisticsAvailableBands06 = ['hourlyPrecipRate']
  const GeostatisticsAvailableBands07 = ['ssm']
  const GeostatisticsAvailableBands08 = ['LST_Day_1km']
  const GeostatisticsAvailableBands10 = ['Fpar', 'Lai']
  const GeostatisticsAvailableBands13 = ['Fpar_500m', 'Lai_500m']
  const GeostatisticsAvailableBands14 = ['NDVI', 'EVI', 'EVI2']

  const GeostatisticsStatistics = ['Min', 'Max', 'Median', 'Mean', 'Variance']

  // FireConsumer Fields
  const FireAnalysisDataset = ['C++', 'Java', 'Python', 'C#']

  let datasetValue = null
  let availableBandsValue = null
  let statisticsValue = null

  let datasetOptions = null
  let availableBandsOptions = null
  let statisticsOptions = null

  if (selected === 'Geostatistics') {
    console.log('Analysis type after selection: ' + selected)
    datasetValue = GeostatisticsDataset

    if (selectedDataset === 0) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands00
    } else if (selectedDataset === 1) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands01
    } else if (selectedDataset === 2) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands02
    } else if (
      selectedDataset === 3 ||
      selectedDataset === 11 ||
      selectedDataset === 12
    ) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands03
    } else if (selectedDataset === 4 || selectedDataset === 5) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands04
    } else if (selectedDataset === 6) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands06
    } else if (selectedDataset === 7) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands07
    } else if (selectedDataset === 8 || selectedDataset === 9) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands08
    } else if (selectedDataset === 10) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands10
    } else if (selectedDataset === 13) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands13
    } else if (selectedDataset === 14) {
      console.log('Dataset after selection: ' + selectedDataset)
      availableBandsValue = GeostatisticsAvailableBands14
    }
  } else if (selected === 'FireAnalysis') {
    datasetValue = FireAnalysisDataset
  }

  statisticsValue = GeostatisticsStatistics

  // Set Options for MenuItem
  if (datasetValue) {
    datasetOptions = datasetValue.map((el) => <option key={el}>{el}</option>)
  }
  if (availableBandsValue) {
    availableBandsOptions = availableBandsValue.map((el) => (
      <option key={el}>{el}</option>
    ))
  }
  if (statisticsValue) {
    statisticsOptions = statisticsValue.map((el) => (
      <option key={el}>{el}</option>
    ))
  }

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
    //e.preventDefault();
    //https://dev.to/omardiaa48/how-to-make-a-robust-form-validation-in-react-with-material-ui-fields-1kb0
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()

        console.log(
          'LINK balance of contract: ' +
            OracleFacingGeoConsumerAddress +
            ' is ' +
            balance,
        )

        const agg_x = await setAggFromStatistics()
        const dataset_code = await setDataset()

        console.log('Agg_x:' + agg_x)
        console.log('dataset_code:' + dataset_code)
        console.log('selected_band: ' + selectedAvailableBands)
        console.log('image_scale: ' + preferredScale)
        console.log('start_date: ' + selectedStartDate)
        console.log('end_date: ' + selectedEndDate)
        console.log('geometry: '+ geometryArray)



          const aggxo = 'agg_mean'
          const datasetcode0 = 'COPERNICUS/S2_SR'
          const selected_band = 'NDVI'
          const image_scale = 250
          const start_date = '2021-09-01'
          const end_date = '2021-09-10'
          const geometry =
            '[[1,[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]]]'


            console.log("Dummy Data")
            console.log('Agg_x:' + aggxo)
            console.log('dataset_code:' + datasetcode0)
            console.log('selected_band: ' + selected_band)
            console.log('image_scale: ' + preferredScale)
            console.log('start_date: ' + start_date)
            console.log('end_date: ' + end_date)
            console.log('geometry: '+ geometry)
    
    
        // if (balance < 1) {
        //   console.log(
        //     'Please fund the contract at ' +
        //       OracleFacingGeoConsumerAddress +
        //       ' with 1 LINK per Oracle call',
        //   )
        // } else {
        //   const agg_x = 'agg_mean'
        //   const dataset_code = 'COPERNICUS/S2_SR'
        //   const selected_band = 'NDVI'
        //   const image_scale = 250
        //   const start_date = '2021-09-01'
        //   const end_date = '2021-09-10'
        //   const geometry =
        //     '[[1,[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]]]'

        //   console.log(
        //     agg_x,
        //     dataset_code,
        //     selected_band,
        //     image_scale,
        //     start_date,
        //     end_date,
        //     geometry,
        //   )

        //   var geometry_array = JSON.parse(geometry)
        //   for (var i = 0; i < geometry_array.length; i++) {
        //     geometry_array[i][1] = JSON.stringify(geometry_array[i][1])
        //   }

        //   const OracleFacingGeoConsumer = new ethers.Contract(
        //     OracleFacingGeoConsumerAddress,
        //     OracleFacingGeoConsumerAbi.abi,
        //     signer,
        //   )

        //   await OracleFacingGeoConsumer.requestGeostatsData(
        //     agg_x,
        //     dataset_code,
        //     selected_band,
        //     image_scale,
        //     start_date,
        //     end_date,
        //     geometry_array,
        //   )
        // }
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

  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value)
  }
  const changeDatasetSelectedOptionHandler = (event) => {
    setSelectedDataset(event.target.value)
  }
  const changeSelectedAvailableBandsOptionHandler = (event) => {
    setSelectedAvailableBands(event.target.value)
  }
  const changePreferredScaleHandler = (event) => {
    setPreferredScale(event.target.value)
  }
  const changeSelectedStatisticsOptionHandler = (event) => {
    setSelectedStatistics(event.target.value)
  }
  const changeSelectedStartDateOptionHandler = (event) => {
    setSelectedStartDate(event.target.value)
  }
  const changeSelectedEndDateOptionHandler = (event) => {
    setSelectedEndDate(event.target.value)
  }

  const changePolygonDimensionHandler = (event) => {
    setPolygonDimensions(event.target.value)
    //  setCount(0)
  }

  const changeGeometryAreaHandler = () => {
    if (polygonDimensions > 0) {
      console.log('Polygon Dimensions: ' + polygonDimensions)
      const area = []
      for (let i = 0; i < polygonDimensions; i++) {
        area[i] = i
      }
      setGeometryArea(area)
    }
  }

  const setAggFromStatistics = () => {
    try {
      if (selectedStatistics === 0) {
        let agg = 'agg_min'
        return agg
      } else if (selectedStatistics === 1) {
        let agg = 'agg_max'
        return agg
      } else if (selectedStatistics === 2) {
        let agg = 'agg_median'
        return agg
      } else if (selectedStatistics === 3) {
        let agg = 'agg_mean'
        return agg
      } else if (selectedStatistics === 4) {
        let agg = 'agg_variance'
        return agg
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setDataset = () => {
    try {
      if (selectedDataset === 0) {
        let ds = 'FAO/WAPOR/2/L1_AETI_D'
        return ds
      } else if (selectedDataset === 1) {
        let ds = 'FAO/WAPOR/2/L1_RET_E'
        return ds
      } else if (selectedDataset === 2) {
        let ds = 'MODIS/006/MOD16A2'
        return ds
      } else if (selectedDataset === 3) {
        let ds = 'COPERNICUS/S2_SR'
        return ds
      } else if (selectedDataset === 4) {
        let ds = 'NOAA/PERSIANN-CDR'
        return ds
      } else if (selectedDataset === 5) {
        let ds = 'UCSB-CHG/CHIRPS/DAILY'
        return ds
      } else if (selectedDataset === 6) {
        let ds = 'JAXA/GPM_L3/GSMaP/v6/operational'
        return ds
      } else if (selectedDataset === 7) {
        let ds = 'NASA_USDA/HSL/SMAP10KM_soil_moisture'
        return ds
      } else if (selectedDataset === 8) {
        let ds = 'MODIS/006/MOD11A1'
        return ds
      } else if (selectedDataset === 9) {
        let ds = 'MODIS/006/MYD11A1'
        return ds
      } else if (selectedDataset === 10) {
        let ds = 'MODIS/006/MCD15A3H'
        return ds
      } else if (selectedDataset === 11) {
        let ds = 'MODIS/006/MOD13Q1'
        return ds
      } else if (selectedDataset === 12) {
        let ds = 'MODIS/006/MYD13Q1'
        return ds
      } else if (selectedDataset === 13) {
        let ds = 'MODIS/006/MYD15A2H'
        return ds
      } else if (selectedDataset === 14) {
        let ds = 'NOAA/VIIRS/001/VNP13A1'
        return ds
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setPolygonCoordinates = () => {
    const geometry =
      '[[1,[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]]]'
    var geometry_array = JSON.parse(geometry)
    for (let i = 0; i < geometry_array.length; i++) {
      geometry_array[i][1] = JSON.stringify(geometry_array[i][1])
    }
    for (let i = 0; i < geometry_array.length; i++) {
      console.log(geometry_array[i][1])
    }
  }

  const changeGeometryValueHandler = (event) => {
    const geometry = event.target.value

    setGeometryArray((oldArray) => [
      ...oldArray,
      [count + 1, [geometry.toString()]],
    ])

    setCount(count + 1)
  }

  const displayGeometryValue = () => {
    console.log('Total number of polygon data: ' + geometryArray.length)
    for (let j = 0; j < geometryArray.length; j++) {
      console.log(
        'Key: ' + geometryArray[j][0] + '  Value: ' + geometryArray[j][1],
      )
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
              disabled
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
              disabled
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
              <div className="App">
                <form>
                  <Divider />
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>

                  <Grid container spacing={30}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth required>
                        <InputLabel
                          id="analysisType-input-label"
                          variant="outlined"
                          style={{ margin: '0px 5px' }}
                          size="small"
                        >
                          Type of Analaysis
                        </InputLabel>
                        <Select
                          labelId="analysisType-label"
                          id="analysisType"
                          value={selected}
                          label="Type of Analaysis"
                          onChange={changeSelectOptionHandler}
                        >
                          <MenuItem value={'Geostatistics'}>
                            Geostatistics
                          </MenuItem>
                          <MenuItem value={'FireAnalysis'}>
                            Fire Analysis
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <br></br>
                  <br></br>

                  <Grid container spacing={24}>
                    <Grid item xs={4}>
                      <FormControl fullWidth required>
                        <InputLabel
                          id="dataset-input-label"
                          variant="outlined"
                          style={{ margin: '0px 5px' }}
                          size="small"
                        >
                          Dataset
                        </InputLabel>
                        <Select
                          labelId="dataset-label"
                          id="dataset"
                          value={selectedDataset}
                          label="Type of Dataset"
                          onChange={changeDatasetSelectedOptionHandler}
                        >
                          <MenuItem defaultValue=""></MenuItem>
                          {datasetOptions
                            ? datasetOptions.map((key, el) => (
                                <MenuItem value={el} key={key}>
                                  {key}
                                </MenuItem>
                              ))
                            : ''}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth required>
                        <InputLabel
                          id="availableBands-input-label"
                          variant="outlined"
                          style={{ margin: '0px 5px' }}
                          size="small"
                        >
                          Available Bands
                        </InputLabel>
                        <Select
                          labelId="availableBands-label"
                          id="availableBands"
                          value={selectedAvailableBands}
                          label="Available Bands"
                          onChange={changeSelectedAvailableBandsOptionHandler}
                        >
                          <MenuItem defaultValue=""></MenuItem>
                          {availableBandsOptions
                            ? availableBandsOptions.map((key, el) => (
                                <MenuItem value={el} key={key}>
                                  {key}
                                </MenuItem>
                              ))
                            : ''}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <TextField
                          required
                          id="preferredScale-number"
                          label="Preferred Scale"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={preferredScale}
                          onChange={changePreferredScaleHandler}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <br></br>
                  <br></br>

                  <Grid container spacing={24}>
                    <Grid item xs={4}>
                      <FormControl fullWidth required>
                        <InputLabel
                          id="statistics-input-label"
                          variant="outlined"
                          style={{ margin: '0px 5px' }}
                          size="small"
                        >
                          Statistics
                        </InputLabel>
                        <Select
                          labelId="statistics-label"
                          id="statistics"
                          value={selectedStatistics}
                          label="Statistics"
                          onChange={changeSelectedStatisticsOptionHandler}
                        >
                          <MenuItem defaultValue=""></MenuItem>
                          {statisticsOptions
                            ? statisticsOptions.map((key, el) => (
                                <MenuItem value={el} key={key}>
                                  {key}
                                </MenuItem>
                              ))
                            : ''}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <TextField
                          required
                          id="startdate"
                          label="Start Date"
                          type="date"
                          defaultValue=" "
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={selectedStartDate}
                          onChange={changeSelectedStartDateOptionHandler}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <TextField
                          required
                          id="enddate"
                          label="End Date"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={selectedEndDate}
                          onChange={changeSelectedEndDateOptionHandler}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <br></br>
                  <br></br>

                  <Grid container spacing={24}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <TextField
                          required
                          id="polygon-dimensions"
                          label="Number of Polygon"
                          type="number"
                          value={polygonDimensions}
                          onChange={changePolygonDimensionHandler}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={changeGeometryAreaHandler}
                        >
                          Select
                        </Button>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <br></br>
                  <br></br>
                  <div>
                    {geometryArea.length > 0 ? (
                      <div>
                        <h4 style={{ color: '#0D80D8' }}>
                          Please enter the respective polygon coordinates
                        </h4>
                        <br></br>
                        {geometryArea.map((index) => (
                          <div>
                            <Grid container spacing={4}>
                              <Grid item xs={4}>
                                <FormControl fullWidth>
                                  <InputLabel
                                    id="index"
                                    variant="outlined"
                                    style={{ margin: '0px 5px' }}
                                    size="small"
                                  >
                                    Enter coordinates array of polygon{' '}
                                    {index + 1}:
                                  </InputLabel>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4}>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={index}
                                    label="Coordinates"
                                    value={geometryValue}
                                    onChange={changeGeometryValueHandler}
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                            <br></br>
                            <br></br>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  <br></br>
                  <br></br>
                  
                  <br></br>
                  <br></br>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendRequest}
                  >
                    Send Request
                  </Button>
                  <br></br>
                  <br></br>
                </form>
              </div>
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
