import { FcGoogle } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthToken, setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../config/axiosConfig";
import { Bounce, ToastContainer, toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const EXPIRY_TIME = 3600;

    const initialValues = {
        email: "",
        password: "",
        isGoogle: false,
    };

    const [profileGoogle, setProfileGoogle] = useState({
        email: "",
        name: "",
        idGoogle: "",
        isGoogle: true,
    });

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Email tidak valid")
            .required("Email wajib diisi"),
        password: Yup.string()
            .min(6, "Minimal 6 karakter")
            .required("Password wajib diisi"),
    });

    const onSubmit = async (values) => {
        try {
            const resp = await API.post("/auth/login", values);
            if (resp.status === 200) {
                const token = resp.data;
                sessionStorage.setItem("tokenJwt", token);
                dispatch(setAuthToken(token));
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
                navigate("/dashboard"); // Navigate to the dashboard upon successful login
            }
        } catch (error) {
            handleLoginError(error);
        }
    };

    const handleLoginError = (error) => {
        console.error("Login failed:", error);
        if (error.response) {
            toast.error(error.response.data.error + ". Please Register");
        } else {
            toast.error("Terjadi kesalahan, silakan coba lagi.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLoginGoogleSuccess = async (response) => {
        const token = response.access_token;
        fetchUserProfileGoogle(token);
    };

    const handleLoginGoogleError = (error) => {
        console.error("Login Failed:", error);
    };

    const hangleGoogleLogin = useGoogleLogin({
        onSuccess: handleLoginGoogleSuccess,
        onError: handleLoginGoogleError,
    });

    const fetchUserProfileGoogle = async (token) => {
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("tokenExpiry", Date.now() + EXPIRY_TIME * 1000);
        try {
            const res = await axios.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            if (res.status === 200) {
                setProfileGoogle({
                    email: res.data.email,
                    name: res.data.name,
                    idGoogle: res.data.id,
                    isGoogle: true,
                });
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    useEffect(() => {
        if (profileGoogle.email) {
            validateLoginGoogle();
        }
    }, [profileGoogle]);

    const validateLoginGoogle = async () => {
        try {
            const res = await API.post("/auth/login", profileGoogle);
            if (res.status === 200) {
                const token = res.data.token;
                const name = res.data.name;
                sessionStorage.setItem("tokenJwt", token);
                dispatch(setAuthToken(token));
                dispatch(setUser(name))
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
                navigate("/dashboard"); // Navigate to dashboard on success
            }
        } catch (error) {
            handleLoginError(error);
            sessionStorage.clear();
        }
    };

    // Check token expiration
    useEffect(() => {
        const tokenExpiry = sessionStorage.getItem("tokenExpiry");
        const now = Date.now();
        const accessToken = sessionStorage.getItem("accessToken");
        if (tokenExpiry && now < tokenExpiry && accessToken) {
            fetchUserProfileGoogle(accessToken);
        } else {
            sessionStorage.clear();
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h1 className="mb-2 font-bold text-3xl text-center">Login</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form className="mb-4">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <Field
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="email"
                                type="email"
                                placeholder="Email"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-xs italic"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Field
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="password"
                                type="password"
                                placeholder="Password"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-xs italic"
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[220px]"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </Form>
                </Formik>
                <div className="flex items-center justify-center mb-2">
                    <div className="px-5">
                        <hr className="border-t border-gray-300 w-[100px]" />
                    </div>
                    <div className="text-center">
                        <div>Atau</div>
                    </div>
                    <div className="px-5">
                        <hr className="border-t border-gray-300 w-[100px]" />
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <button
                            className="bg-white border border-2xl text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center w-[220px]"
                            type="submit"
                            onClick={hangleGoogleLogin}
                        >
                            <FcGoogle className="me-2" /> Login with Google
                        </button>
                    </div>
                    <div>
                        <p>
                            Belum punya akun? Ayo{" "}
                            <span
                                className="text-blue-500 font-bold cursor-pointer"
                                onClick={handleRegister}
                            >
                                daftar
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Bounce}
            />
        </div>
    );
};

export default Login;
