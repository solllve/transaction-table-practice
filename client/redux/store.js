import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { data } from "autoprefixer";
import {
    sortByData
} from '../components/common'
let defaultBool = false;

export const fetchApi = data => ({
    type: 'fetchAction',
    payload: {
        data
    }
})

export const sortData = (item, sortOrder) => ({
    type: 'sortDataAction',
    payload: {
        item,
        sortOrder
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
        defaultBool = !defaultBool;
        sortData.sort(function(a, b) {
            switch(action.payload.item) {
                case 'Type':
                    if (defaultBool) {
                        if (a.type < b.type) {
                            return -1;
                        }
                        if (a.type > b.type) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.type < b.type) {
                            return 1;
                        }
                        if (a.type > b.type) {
                            return -1;
                        }
                        return 0;
                    }
                case 'Coin':
                    if (defaultBool) {
                        if (a.coin < b.coin) {
                            return -1;
                        }
                        if (a.coin > b.coin) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.coin < b.coin) {
                            return 1;
                        }
                        if (a.coin > b.coin) {
                            return -1;
                        }
                        return 0;
                    }
                case 'Status':
                    if (defaultBool) {
                        if (a.status < b.status) {
                            return -1;
                        }
                        if (a.status > b.status) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.status < b.status) {
                            return 1;
                        }
                        if (a.status > b.status) {
                            return -1;
                        }
                        return 0;
                    }
                    
                case 'To':
                    if (defaultBool) {
                        if (a.to < b.to) {
                            return -1;
                        }
                        if (a.to > b.to) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.to < b.to) {
                            return 1;
                        }
                        if (a.to > b.to) {
                            return -1;
                        }
                        return 0;
                    }
                case 'From':
                    if (defaultBool) {
                        if (a.from < b.from) {
                            return -1;
                        }
                        if (a.from > b.from) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.from < b.from) {
                            return 1;
                        }
                        if (a.from > b.from) {
                            return -1;
                        }
                        return 0;
                    }
                    
                case 'Amount':
                    if (defaultBool) {
                        if (a.coin < b.coin) {
                            return -1;
                        }
                        if (a.coin > b.coin) {
                            return 1;
                        }
                        return 0;
                    }
                    else {
                        if (a.coin < b.coin) {
                            return 1;
                        }
                        if (a.coin > b.coin) {
                            return -1;
                        }
                        return 0;
                    }
                case 'Date':
                    if (defaultBool) {
                        return a.date.raw - b.date.raw;
                    }
                    else {
                        return b.date.raw - a.date.raw;
                    }
                    
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