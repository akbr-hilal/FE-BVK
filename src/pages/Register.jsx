import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { API } from "../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setProfile } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import axios from "axios";

const Register = () => {
    const dispatch = useDispatch(); // Inisialisasi dispatch
    let navigate = useNavigate();

    // State untuk menyimpan data form
    const initialValues = {
        name: "",
        email: "",
        password: "",
        isGoogle: false,
    };

    // Set expired time in seconds
    const EXPIRY_TIME = 3600; // 1 hour

    //validate schema register
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(3, "Minimal 3 karakter")
            .required("Email wajib diisi"),
        email: Yup.string()
            .email("Email tidak valid")
            .required("Email wajib diisi"),
        password: Yup.string()
            .min(6, "Minimal 6 karakter")
            .required("Password wajib diisi"),
    });

    //State profile register
    const [profileGoogle, setProfileGoogle] = useState({
        email: "",
        name: "",
        idGoogle: "",
        isGoogle: true,
    });

    //handle button login
    const handleLogin = () => {
        navigate("/");
    };

    // Fungsi untuk handle pendaftaran normal (dengan nama, email, dan password)
    const onSubmit = async (values) => {
        try {
            const response = await API.post("/auth/register", values);
            console.log("response: ", response);
            // Jika login berhasil
            if (response.status === 200) {
                // const userProfile = response.data;
                // dispatch(setProfile(userProfile));
                // sessionStorage.setItem("profile", JSON.stringify(userProfile));
                toast.success(response.data);
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

    // function to handle register google error
    const handleRegisterGoogleError = (error) => {
        console.error("Register Google Failed:", error);
    };

    // function to handle register google error
    const handleRegisterGoogleSuccess = (response) => {
        console.log("Resp Register Google: ", response);
        const token = response.access_token;

        try {
            fetchUserProfileGoogle(token);
        } catch (error) {
            console.error("Token validation failed:", error);
        }
    };

    useEffect(() => {
        if (profileGoogle.email !== "") {
            saveDataUserGoogle();
        }
    }, [profileGoogle]);

    // function to fetch user profile
    const fetchUserProfileGoogle = async (token) => {
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("tokenExpiry", Date.now() + EXPIRY_TIME * 1000); // Store expiry time
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
            console.log("res googlapis: ", res);
            if (res.status === 200) {
                dispatch(setProfile(res.data));
                setProfileGoogle({
                    email: res.data.email,
                    name: res.data.name,
                    idGoogle: res.data.id,
                    isGoogle: true,
                });
            } else {
                console.error("No profile data received");
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const saveDataUserGoogle = async () => {
        try {
            console.log("profile Google: ", profileGoogle);
            const resp = await API.post("/auth/register", profileGoogle);
            console.log("resp register google: ", resp);
            if (resp.status === 200) {
                toast.success(resp.data)
            }
        } catch (error) {
            console.error("error save data user google: ", error);
        }
    };

    // Fungsi untuk pendaftaran melalui Google
    const handleGoogleRegister = useGoogleLogin({
        onSuccess: handleRegisterGoogleSuccess,
        onError: handleRegisterGoogleError,
    });

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
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <Field
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="name"
                                type="name"
                                placeholder="Name"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-xs italic"
                            />
                        </div>
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
                                Register
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
                            onClick={() => handleGoogleRegister()}
                        >
                            <FcGoogle className="me-2" />
                            Register with Google
                        </button>
                    </div>
                    <div>
                        <p>
                            Sudah punya akun?{" "}
                            <span
                                className="text-blue-500 font-bold cursor-pointer"
                                onClick={() => handleLogin()}
                            >
                                Masuk Sekarang
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

export default Register;
