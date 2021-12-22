import { configureStore, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApi = data => ({
    type: 'fetchAction',
    payload: {
        data
    }
})

function getTransactions(state = {}, action) {
    if (action.type === 'fetchAction') {
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
        transactions: getTransactions
      },
    }
);

export default store;