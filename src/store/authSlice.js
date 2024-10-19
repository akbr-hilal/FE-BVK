import { createSlice } from "@reduxjs/toolkit";
import { API } from "../config/axiosConfig"; // Pastikan config axios sudah benar

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: sessionStorage.getItem("tokenJwt") || null,
        isAuthenticated: !!sessionStorage.getItem("tokenJwt"), // Autentikasi berdasarkan token
        loading: false,
    },
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            sessionStorage.setItem("tokenJwt", action.payload);
        },
        setUser: (state, action) => {
            state.user = action.payload; // Set user information
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem("tokenJwt");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("tokenExpiry");
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setAuthToken, setUser, logout, setLoading } = authSlice.actions;

export const checkAuthToken = () => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
        dispatch(logout());
        return;
    }

    dispatch(setLoading(true));

    try {
        const res = await API.get("/auth/check-token", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 200) {
            dispatch(setAuthToken(token));
            dispatch(setUser(res.data.name));
        } else {
            dispatch(logout());
        }
    } catch (err) {
        console.error(err)
        dispatch(logout());
    } finally {
        dispatch(setLoading(false));
    }
};

export default authSlice.reducer;
