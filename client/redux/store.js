import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { data } from "autoprefixer";

export const fetchApi = data => ({
    type: 'fetchAction',
    payload: {
        data
    }
})

export const sortData = label => ({
    type: 'sortDataAction',
    payload: {
        label
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
            let nameA = a.type.toLowerCase();
            let nameB = b.type.toLowerCase(); 
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
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