import React, { useEffect, useState, setState } from "react";
import server from "../environment";
import store, { fetchApi, loadedAction, sortData } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import {
    formatDateRaw, 
    sortByDecendingDate, 
    formatDate, 
    truncateWallets, 
    formatStatus,
    getDate,
    searchTransactions
} from './common'
import {
    web3,
    getEthTimestamp,
    formatCryptoData,
    getCoin,
    arrayOfEthDates
} from './commonCrypto'
import {
    rowTemplate,
    headerTemplate
} from './templates'

const transactionFormat = (data) => {
    const rawData = data[0].concat(data[1], data[2]);
    const cleanedData = []
    rawData.forEach(item => {
        cleanedData.push({
            type: formatStatus(item.type),
            coin: getCoin(item.coin, item.to, item.from),
            to: item.to,
            from: item.from,
            transaction: {
                fiat: item.fiatValue,
                crypto: item.amount,
                raw: item.amount
            },
            date: {
                cleaned: getDate(item),
                raw: formatDateRaw(item.createdAt || item.insertedAt || item.date)
            },
            status: formatStatus(item.state)
        })
    })
    //order of operations
    sortByDecendingDate(cleanedData)
    formatDate(cleanedData)
    formatCryptoData(cleanedData)
    console.log(cleanedData);
    return cleanedData
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
                {headerTemplate('Status')}
                {headerTemplate('Coin')}
                {headerTemplate('Type')}
                
                
                {headerTemplate('To')}
                {headerTemplate('From')}
                {headerTemplate('Amount (Fiat)')}
                {headerTemplate('Amount (Crypto)')}
                {headerTemplate('Date')}
                </li>
            {store.transactions.data.map(item => (
                
                <li key={i++} className="py-4 flex">
                    {rowTemplate(item.status, 'Status:')}
                    {rowTemplate(item.coin, 'Coin:')}
                    {rowTemplate(item.type, 'Type:')}
                    
                    
                    {rowTemplate(item.to, 'To:')}
                    {rowTemplate(item.from, 'From:')}
                    {rowTemplate(item.transaction.fiat, 'Amount (Fiat):')}
                    {rowTemplate(item.transaction.crypto, 'Amount (Crypto):')}
                    {rowTemplate(item.date.cleaned, 'Date:')}
                </li>
            ))}
            </ul>
        </div>
    )      
}
export default Table;