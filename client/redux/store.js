import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApi = data => ({
    type: 'fetchEthAction',
    payload: {
        data
    }
})

function getEthTransactions(state = {}, action) {
    if (action.type === 'fetchEthAction') {
        return {
        ...state,
        data: action.payload.data
        }  
    }
    return state
}

const store = configureStore(
    {
      reducer: {
        ethTransactions: getEthTransactions
      },
    }
);

export default store;