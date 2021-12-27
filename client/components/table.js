import React, { useEffect, useState, setState } from "react";
import server from "../environment";
import store, { fetchApi, loadedAction, sortData } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('https://cloudflare-eth.com'));

const getEthTimestamp = (blockNum) => {
    let blockParse = Number(blockNum)
    const block = web3.eth.getBlock(blockParse);
    block.then(data => {
        return data.timestamp
    });
}
const formatDateRaw = (date) => {
    if (typeof date === 'number') {
        let timeConvert = String(date) + '000';
        return Number(timeConvert);
    }
    else {
        let parseDate = Date.parse(date);
        return parseDate;
    }
}
const sortByDecendingDate = (data) => {
    data.sort((a, b) => {
        return b.date.raw - a.date.raw
    })
}
const formatDate = (date) => {
    date.forEach(item => {
        let dateParse = new Date(item.date.cleaned).toLocaleDateString("en-US")
        item.date.cleaned = dateParse
    })
}
const truncateWallets = (data) => {
    let walletShort = data.substring(0, 20)
    return walletShort
}
const formatCryptoData = (data) => {
    data.forEach(item => {
        let coin = 'BTC'
        //if eth
        if (web3.utils.isAddress(item.to) || web3.utils.isAddress(item.from)) {
            let ethFormat = web3.utils.fromWei(String(item.amount.crypto), 'ether');
            item.amount.crypto = Number(ethFormat).toFixed(7)
            item.to = truncateWallets(item.to)
            item.from = truncateWallets(item.from)
        }
        //if btc
        else if (validate(item.to) || validate(item.from)) {
            let btcFormat = Number(item.amount.crypto) / 100000000;
            let btcFormatFixed = btcFormat.toFixed(7); 
            item.amount.crypto = btcFormatFixed
            item.to = truncateWallets(item.to)
            item.from = truncateWallets(item.from)
        }
    })
}
const formatStatus = (data) => {
    if (typeof data === 'string') {
        return data.toLowerCase()
    }
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
const getDate = (item) => {
    if (typeof item.createdAt === 'string') {
        let parseDate = Date.parse(item.createdAt);
        return parseDate;
    }
    // check if eths
    else if (typeof item.insertedAt === 'number') {
        let timeConvert = String(item.insertedAt) + '000';
        return Number(timeConvert);
    }
    else {
        return 'no date found'
    }
}
const searchTransactions = (data, searchTerm) => {
    //const dispatch = useDispatch();
    if (typeof searchTerm !== '') {
        let searchTermLower = searchTerm.toLowerCase();
        let searchResults = data.filter(item => {
            const searchItem = (item) => {
                if (item !== undefined) {
                    return item.toLowerCase().indexOf(searchTermLower) !== -1
                }
            }
            return searchItem(item.type) || searchItem(item.date.cleaned) || searchItem(item.from) || searchItem(item.to) || searchItem(item.status) || searchItem(item.amount.fiat) || searchItem(item.amount.crypto) || searchItem(item.coin)
        })
        return searchResults
    }
    else {
        return data
    }
   // dispatch(fetchApi(searchResults));
}
const transactionFormat = (data) => {
    const rawData = data[0].concat(data[1], data[2]);
    //console.log(rawData);
    const cleanedData = []
    rawData.forEach(item => {
        cleanedData.push({
            type: formatStatus(item.type),
            coin: getCoin(item.coin, item.to, item.from),
            to: item.to,
            from: item.from,
            amountFiat: item.fiatValue,
            amountCrypto: item.amount,
            amount: {
                fiat: item.fiatValue,
                crypto: item.amount
            },
            date: {
                cleaned: getDate(item),
                raw: formatDateRaw(item.createdAt || item.insertedAt || item.date)
            },
            status: formatStatus(item.state)
        })
    })
    //order of operations
    //console.log(cleanedData);
    sortByDecendingDate(cleanedData)
    formatDate(cleanedData)
    formatCryptoData(cleanedData)
    return cleanedData
}
const rawDataCount = (data) => {
    //Real world I would do this better.
    const rawData = data[0].concat(data[1], data[2]);
    return rawData.length
}
const arrayOfEthDates = (data) => {
    return web3.eth.getBlock(blockParse)
}
const rowTemplate = (item, label) => {
    if (typeof item === 'string' || typeof item === 'number') {
        return (
            <div className="min-w-0 flex-1 flex items-center">
                <div className="data__inner">
                    <span className="label">{label}</span>
                    <span className="value capitalize">{item}</span>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="min-w-0 flex-1 flex items-center">
                <div className="data__inner">
                    <span className="label">{label}</span>
                    <span className="value"> - </span>
                </div>
            </div>
        )
    }
}
const headerTemplate = (label) => {
    const dispatch = useDispatch();
    return (
        <div className="min-w-0 flex-1 flex items-center">
            <div className="data__inner">
                <span onClick={() => dispatch(sortData(label))} className="label header__link">{label}</span>
            </div>
        </div>
    )
}

const Table = () => {
    let i = 0;
    const store = useSelector(state => state);
    const dispatch = useDispatch();
    useEffect(() => {
        const initialData = window.sessionStorage.getItem('transactions');
        // if (initialData !== null) {
        //     dispatch(fetchApi(JSON.parse(initialData)));
        // }
        // else {
            dispatch(loadedAction(false));
            Promise.all([
                fetch(server.ethApiUrl),
                fetch(server.custodialApiUrl),
                fetch(server.btcApiUrl)
            ]).then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json()
                }));
            }).then(function (data) {
                const transactions = transactionFormat(data)
                //send cleaned data to redux store
                dispatch(loadedAction(true));
                dispatch(fetchApi(transactions));
                //store the session
                window.sessionStorage.setItem('transactions', JSON.stringify(transactions));
            }).catch(function (error) {
                console.log(error);    
            });
        // }
       
    }, [dispatch]);
    return (
        <div>
            <div className="header">
                <div className="header__inner">
                <input className="searchBar" type="text" placeholder="Search" onChange={(e) => {
                    let searchTerm = e.target.value;
                    let searchResults = searchTransactions(store.transactions.data, searchTerm)
                    dispatch(fetchApi(searchResults));
                    if (searchTerm == '') {
                        const initialData = window.sessionStorage.getItem('transactions');
                        dispatch(fetchApi(JSON.parse(initialData)));
                    }
                    //console.log(searchResults)
                }}></input>
                </div>
            </div>
            <ul role="list" className="transaction__list divide-y divide-gray-700">
                <li className="py-4 flex">
                {headerTemplate('Type')}
                {headerTemplate('Coin')}
                {headerTemplate('Status')}
                {headerTemplate('To')}
                {headerTemplate('From')}
                {headerTemplate('Amount (Fiat)')}
                {headerTemplate('Amount (Crypto)')}
                {headerTemplate('Date')}
                </li>
            {store.transactions.data.map(item => (
                <li key={i++} className="py-4 flex">
                    {rowTemplate(item.type, 'Type:')}
                    {rowTemplate(item.coin, 'Coin:')}
                    {rowTemplate(item.status, 'Status:')}
                    {rowTemplate(item.to, 'To:')}
                    {rowTemplate(item.from, 'From:')}
                    {rowTemplate(item.amount.fiat, 'Amount (Fiat):')}
                    {rowTemplate(item.amount.crypto, 'Amount (Crypto):')}
                    {rowTemplate(item.date.cleaned, 'Date:')}
                </li>
            ))}
            </ul>
        </div>
    )      
}
export default Table;