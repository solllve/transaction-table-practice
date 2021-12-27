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
const formatStatus = (data) => {
    if (typeof data === 'string') {
        return data.toLowerCase()
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
    if (typeof searchTerm !== '') {
        let searchTermLower = searchTerm.toLowerCase();
        let searchResults = data.filter(item => {
            const searchItem = (item) => {
                if (item !== undefined) {
                    return item.toLowerCase().indexOf(searchTermLower) !== -1
                }
            }
            return searchItem(item.type) || searchItem(item.date.cleaned) || searchItem(item.from) || searchItem(item.to) || searchItem(item.status) || searchItem(item.transaction.fiat) || searchItem(item.transaction.crypto) || searchItem(item.coin)
        })
        return searchResults
    }
    else {
        return data
    }
}
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
const determineAmount = (data) => {
    if (typeof data.crypto === 'string') {
        return data.crypto
    }
    else {
        return '$' + data.fiat
    }
    
}
export {
    formatDateRaw, 
    sortByDecendingDate,
    formatDate,
    getDate,
    truncateWallets,
    formatStatus,
    searchTransactions,
    transactionFormat,
    determineAmount
};