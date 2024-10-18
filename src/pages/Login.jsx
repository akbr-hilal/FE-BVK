import { FcGoogle } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProfile } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../config/axiosConfig";
import { Bounce, ToastContainer, toast } from "react-toastify";

const Login = () => {
    let navigate = useNavigate();
    const initialValues = {
        email: "",
        password: "",
    };

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
            const response = await API.post("/auth/login", values);
            console.log("response: ", response);
            // Jika login berhasil
            if (response.status === 200) {
                const userProfile = response.data;
                dispatch(setProfile(userProfile));
                sessionStorage.setItem("profile", JSON.stringify(userProfile));
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response) {
                console.log("response: ", error.response.data.error);
                toast.error(error.response.data.error);
            } else {
                console.log("Kesalahan: ", error.message);
                toast.error("Terjadi kesalahan, silakan coba lagi.");
            }
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const dispatch = useDispatch(); // Inisialisasi dispatch

    const [accessToken, setAccessToken] = useState(
        sessionStorage.getItem("accessToken")
    );

    // Set expired time in seconds
    const EXPIRY_TIME = 3600; // 1 hour

    // function to handle login success via oauth
    const handleLoginSuccess = async (response) => {
        console.log("Resp Login Google: ", response);
        const token = response.access_token;

        // Send the token to the backend for validation
        try {
            const response = await API.post("/auth/login/google", {
                token,
            });
            console.log("response: ", response);
            if (response.status === 200) {
                const userProfile = response.data; // Ambil profil pengguna dari respons
                dispatch(setProfile(userProfile)); // Simpan profil ke redux
                sessionStorage.setItem("profile", JSON.stringify(userProfile)); // Simpan profil ke sessionStorage
                setAccessToken(token);
                sessionStorage.setItem("accessToken", token);
                sessionStorage.setItem(
                    "tokenExpiry",
                    Date.now() + EXPIRY_TIME * 1000
                ); // Store expiry time
                navigate("/dashboard"); // Ganti dengan rute yang sesuai
            } 
            // else {
            //     console.error("User not found in database");
            // }
        } catch (error) {
            console.error("Token validation failed:", error);
        }
    };

    // function to handle login error
    const handleLoginError = (error) => {
        console.error("Login Failed:", error);
    };

    // function to login with google
    const login = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
    });

    // function to fetch user profile
    const fetchUserProfile = async (token) => {
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

            if (res.data) {
                dispatch(setProfile(res.data));
                sessionStorage.setItem("profile", JSON.stringify(res.data)); // Save profile to sessionStorage
                console.log("Profile fetched: ", res.data);
            } else {
                console.error("No profile data received");
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    // useEffect to fetch profile when token exists
    useEffect(() => {
        const tokenExpiry = sessionStorage.getItem("tokenExpiry");
        const now = Date.now();

        // Check if token is expired
        if (tokenExpiry && now < tokenExpiry) {
            if (accessToken) {
                fetchUserProfile(accessToken);
            }
        } else {
            // Clear sessionStorage if expired
            sessionStorage.clear();
        }
    }, [accessToken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h1 className="mb-2 font-bold text-3xl text-center">Login</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form className=" mb-4">
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
                        <hr className="border-t border-gray-300 w-[100px] " />{" "}
                        {/* Menambahkan kelas border dan width */}
                    </div>
                    <div className=" text-center">
                        <div>Atau</div>
                    </div>
                    <div className="px-5">
                        <hr className="border-t border-gray-300 w-[100px]" />{" "}
                        {/* Menambahkan kelas border dan width */}
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <button
                            className="bg-white border border-2xl text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center w-[220px]"
                            type="submit"
                            onClick={() => login()}
                        >
                            <FcGoogle className="me-2" />
                            Login with Google
                        </button>
                    </div>
                    <div>
                        <p>
                            Belum punya akun? Ayo{" "}
                            <span
                                className="text-blue-500 font-bold cursor-pointer"
                                onClick={() => handleRegister()}
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
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default Login;
