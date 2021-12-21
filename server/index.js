const express = require('express')
const cors = require('cors')

// data mocks
const btcTxMock = require('./__mocks__/btc-noncustodial.json')
const ethTxMock = require('./__mocks__/eth-noncustodial.json')
const custodialTxMock = require('./__mocks__/custodial.json')
const pricesMock = require('./__mocks__/prices.json')

const app = express()
const PORT = 8888

app.use(cors())
app.get('/btc-txs', (req, res) => res.send(btcTxMock))
app.get('/eth-txs', (req, res) => res.send(ethTxMock))
app.get('/custodial-txs', (req, res) => res.send(custodialTxMock))
app.get('/prices', (req, res) => res.send(pricesMock))

app.get('/', (req, res) => {
  res.send(`
    <h1>👋</h1>
    <h2>Transactions API</h2>
    <ul>
      <li><a target="_blank" href="/btc-txs">BTC Transactions</a></li>
      <li><a target="_blank" href="/eth-txs">ETH Transactions</a></li>
      <li><a target="_blank" href="/custodial-txs">Custodial Transactions</a></li>
      <li><a target="_blank" href="/prices">Prices</a></li>
    </ul>
  `)
})

app.listen(8888, () => console.log(`Blockchain server listening on port ${PORT}`))