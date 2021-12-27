import Web3 from 'web3'
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import { truncateWallets } from './common';
const web3 = new Web3(new Web3.providers.HttpProvider('https://cloudflare-eth.com'));
const getEthTimestamp = (blockNum) => {
    let blockParse = Number(blockNum)
    const block = web3.eth.getBlock(blockParse);
    block.then(data => {
        return data.timestamp
    });
}
const formatCryptoData = (data) => {
    data.forEach(item => {
        //if eth
        if (web3.utils.isAddress(item.to) || web3.utils.isAddress(item.from)) { 
            let ethFormat = web3.utils.fromWei(String(item.transaction.crypto), 'ether');
            item.transaction.crypto = Number(ethFormat).toFixed(7)
            item.transaction.raw = Number(item.transaction.crypto)
            item.to = truncateWallets(item.to)
            item.from = truncateWallets(item.from)
        }
        //if btc
        else if (validate(item.to) || validate(item.from)) {
            let btcFormat = Number(item.transaction.crypto) / 100000000;
            item.transaction.raw = item.transaction.crypto
            let btcFormatFixed = btcFormat.toFixed(7); 
            item.transaction.crypto = btcFormatFixed
            item.transaction.raw = Number(item.transaction.crypto)
            item.to = truncateWallets(item.to)
            item.from = truncateWallets(item.from)
        }
    })
}
const getCoin = (coin, to, from) => {
    if (typeof coin === 'string') {
        return coin
    }
    else if (web3.utils.isAddress(to) || web3.utils.isAddress(from)) {
        return 'ETH'
    }
    else {
        return 'USD'
    }
}
const arrayOfEthDates = (data) => {
    return web3.eth.getBlock(blockParse)
}
export {
    web3,
    getEthTimestamp,
    formatCryptoData,
    getCoin,
    arrayOfEthDates
};