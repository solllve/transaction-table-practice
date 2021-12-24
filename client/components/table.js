import React, { useEffect, useState } from "react";
import server from "../environment";
import store, { fetchApi, loadedAction } from '../redux/store';
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

const sortByDecendingDate = (data) => {
    data.sort((a, b) => {
        return b.date - a.date
    })
}

const formatDate = (date) => {
    date.forEach(item => {
        let dateParse = new Date(item.date).toLocaleDateString("en-US")
        item.date = dateParse
    })
}

const formatCryptoData = (data) => {
    data.forEach(item => {
        //if eth
        if (web3.utils.isAddress(item.to) || web3.utils.isAddress(item.from)) {
            let ethFormat = web3.utils.fromWei(String(item.amountCrypto), 'ether');
            item.amountCrypto = Number(ethFormat).toFixed(7)
        }
        //if btc
        else if (validate(item.to) || validate(item.from)) {
            let btcFormat = Number(item.amountCrypto) / 100000000;
            let btcFormatFixed = btcFormat.toFixed(7); 
            item.amountCrypto = btcFormatFixed
        }
    })
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
    let searchResults = data.filter(item => {
        return item.type.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || item.status.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    })
    return searchResults

}
  
const transactionFormat = (data) => {
    const rawData = data[0].concat(data[1], data[2]);
    //console.log(rawData);
    const cleanedData = []
    rawData.forEach(item => {
        cleanedData.push({
            type: item.type,
            to: item.to,
            from: item.from,
            amountFiat: item.fiatValue,
            amountCrypto: item.amount,
            date: getDate(item),
            status: item.state
        })
    })
    //order of operations
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

const Table = () => {
    const store = useSelector(state => state);
    const dispatch = useDispatch();
    const [dataState, getData] = useState([
        {
            "amountCrypto": '',
            "amountFiat": '',
            "date": '',
            "from": '',
            "status": '',
            "to": '',
            "type": ''
        }  
    ]);
    useEffect(() => {
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
            // dispatch(loadedAction(true));
            // dispatch(fetchApi(transactions));
            getData(transactions)
        }).catch(function (error) {
            console.log(error);    
        });
    }, [dispatch, getData]);
    let i = 0;
    return (
        <div>
            <input className="searchBar" type="text" placeholder="Search" onChange={(e) => {
                let searchTerm = e.target.value;
                let searchResults = searchTransactions(dataState, searchTerm)
                console.log(searchResults)
                getData(searchResults)
            }}></input>
            <ul role="list" className="transaction__list divide-y divide-gray-700">
            {dataState.map(item => (
                <li key={i++} className="py-4 flex">
                    <span className="min-w-0 flex-1 flex items-center">{item.type}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.status}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.to}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.from}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.amountFiat}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.amountCrypto}</span>
                    <span className="min-w-0 flex-1 flex items-center">{item.date}</span>
                </li>
            ))}
            </ul>
        </div>
    )
         
}

export default Table;