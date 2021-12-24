import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApi = data => ({
    type: 'fetchAction',
    payload: {
        data
    }
})

export const loadedAction = bool => ({
    type: 'loadedAction',
    payload: {
        loaded: bool
    }
})

function getTransactions(state = {}, action) {
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