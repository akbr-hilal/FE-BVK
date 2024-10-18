import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store.js";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="557922696929-17ah9ac32qtc0rgdgcgc5h14vhmqcc17.apps.googleusercontent.com">
        <StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </StrictMode>
    </GoogleOAuthProvider>
);
