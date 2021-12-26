import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { data } from "autoprefixer";

export const fetchApi = data => ({
    type: 'fetchAction',
    payload: {
        data
    }
})

export const sortData = item => ({
    type: 'sortDataAction',
    payload: {
        item
    }
})

export const loadedAction = bool => ({
    type: 'loadedAction',
    payload: {
        loaded: bool
    }
})

function getTransactions(state = {data: []}, action) {
    if (action.type === 'fetchAction') {
        return {
            ...state,
            data: action.payload.data
        }  
    }
    if (action.type === 'loadedAction') {
        return {
            ...state,
            loaded: action.payload.loaded
        }  
    }
    if (action.type === 'sortDataAction') {
        const sortData = [...state.data]
        sortData.sort(function(a, b) {
        //admittedly a very silly way of doing this. Might clean up later.
            switch(action.payload.item) {
                case 'Type':
                    if (a.type < b.type) {
                        return -1;
                    }
                    if (a.type > b.type) {
                        return 1;
                    }
                    return 0;
                case 'Coin':
                    if (a.coin < b.coin) {
                        return -1;
                    }
                    if (a.coin > b.coin) {
                        return 1;
                    }
                    return 0;
                case 'Status':
                    if (a.status < b.status) {
                        return -1;
                    }
                    if (a.status > b.status) {
                        return 1;
                    }
                    return 0;
                case 'To':
                    if (a.to < b.to) {
                        return -1;
                    }
                    if (a.to > b.to) {
                        return 1;
                    }
                    return 0;
                case 'From':
                    if (a.from < b.from) {
                        return -1;
                    }
                    if (a.from > b.from) {
                        return 1;
                    }
                    return 0;
                case 'Amount (Fiat)':
                    if (a.from < b.from) {
                        return -1;
                    }
                    if (a.from > b.from) {
                        return 1;
                    }
                    return 0;
                case 'Amount (Crypto)':
                    if (a.from < b.from) {
                        return -1;
                    }
                    if (a.from > b.from) {
                        return 1;
                    }
                    return 0;
                case 'Date':
                    if (a.from < b.from) {
                        return -1;
                    }
                    if (a.from > b.from) {
                        return 1;
                    }
                    return 0;
            }    
        });
        return {data: sortData}
    }
    return state
}

const store = configureStore(
    {
      reducer: {
        transactions: getTransactions
      },
    }
);

export default store;