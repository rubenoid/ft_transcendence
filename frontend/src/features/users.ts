import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchData } from '../API/API';
import { User } from '../Types/Types';

export const fetchUserByUserName = createAsyncThunk('users/fetchUserByUserName', async (userName: string) => {
    const endpoint = `/user/getByUserName/${userName}`;
    return await fetchData(endpoint);
})

let user: User = null;

const getUserSlice = createSlice({
    name: 'getUserByUserName',
    initialState: user,
    reducers:{

    },
    extraReducers: {
        [fetchUserByUserName.fulfilled]: (state, action) => {
            state.
        }
    }
})