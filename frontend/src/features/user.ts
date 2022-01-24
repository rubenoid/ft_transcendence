import { createSlice } from '@reduxjs/toolkit';
import { User } from '../Types/Types';

let user: User = null;

export const userSlice = createSlice({
    name: "user",
    initialState: { value: user },
    reducers: {
        openChatBox: (state, action) => {state.value = action.payload},
    }
});

export const { openChatBox } = userSlice.actions;

export default userSlice.reducer;