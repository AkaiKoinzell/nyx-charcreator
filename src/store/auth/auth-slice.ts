import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState { state: boolean }

const initialState: AuthState = {
    state: false
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuthenticationState: (state, action: PayloadAction<boolean>) => {
            state.state = action.payload
        }
    }
})

export const { setAuthenticationState } = authSlice.actions
export const authReducer = authSlice.reducer
export const authSelector = (state: RootState) => state.auth.state