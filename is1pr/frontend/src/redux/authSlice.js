import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const initialState = {
    token: isBrowser ? localStorage.getItem("jwtToken") : null,
    username: isBrowser ? localStorage.getItem("username") : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            const { token, username} = action.payload;
            state.token = token;
            state.username = username;

            localStorage.setItem("jwtToken", token);
            localStorage.setItem("username", username);
        },
        clearAuthData: (state) => {
            state.token = null;
            state.username = null;

            localStorage.removeItem("jwtToken");
            localStorage.removeItem("username");
        },

    },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
