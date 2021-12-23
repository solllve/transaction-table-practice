import React, {useEffect} from 'react';
import server from "../environment";
import { fetchApi } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('https://cloudflare-eth.com'));

const people = [
    { name: 'Jane Cooper', title: 'Regional Paradigm Technician', role: 'Admin', email: 'jane.cooper@example.com' },
    // More people...
]

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
            let btcFormatFixed = btcFormat.toFixed(8); 
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
  
const transactionFormat = (data) => {
    const rawData = data[0].concat(data[1], data[2]);
    console.log(rawData);
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
    console.log(cleanedData)
}

const rawDataCount = (data) => {
    const rawData = data[0].concat(data[1], data[2]);
    return rawData.length
}

const arrayOfEthDates = (data) => {
    return web3.eth.getBlock(blockParse)
}

const Table = () => {

    const dispatch = useDispatch();
    const store = useSelector(state => state);

    useEffect(() => {

        Promise.all([
            fetch(server.ethApiUrl),
            fetch(server.custodialApiUrl),
            fetch(server.btcApiUrl)
        ]).then(function (responses) {
            
            return Promise.all(responses.map(function (response) {
                return response.json()
            }));

        }).then(function (data) {

            transactionFormat(data)
            
        }).catch(function (error) {
            console.log(error);
        });
       
    })

    return (
        <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Title
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {people.map((person) => (
                    <tr key={person.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Table;