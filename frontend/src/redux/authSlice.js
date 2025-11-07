import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const initialState = {
    token: isBrowser ? localStorage.getItem("jwtToken") : null,
    username: isBrowser ? localStorage.getItem("username") : null,
    role: isBrowser ? localStorage.getItem("role") : null, // Новое поле
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            const { token, username, role } = action.payload;
            state.token = token;
            state.username = username;
            state.role = role;

            localStorage.setItem("jwtToken", token);
            localStorage.setItem("username", username);
            localStorage.setItem("role", role);
        },
        clearAuthData: (state) => {
            state.token = null;
            state.username = null;
            state.role = null;

            localStorage.removeItem("jwtToken");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
        },
        updateRole: (state, action) => {
            state.role = action.payload;
            localStorage.setItem("role", action.payload);
        },
    },
});

export const { setAuthData, clearAuthData, updateRole } = authSlice.actions;
export default authSlice.reducer;
