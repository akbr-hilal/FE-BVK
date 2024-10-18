import { Link } from "react-router-dom";
import ilustrationNotFound from "../assets/ilustrasi-not-found.svg";
import { Footer } from "../components";

function NotFound() {
    return (
        <div className="h-screen flex flex-col justify-between">
            <div className="px-8 py-4 flex items-center">
                <div className="text-[#0093E5]">
                    <p className="font-bold text-2xl">BVK</p>
                </div>
            </div>

            <div className="flex flex-grow justify-center items-center">
                <div>
                    <img
                        src={ilustrationNotFound}
                        alt="Ilustrasi Not Found"
                        className="w-[500px] h-auto"
                    />
                    <p className="text-center font-bold text-3xl text-[#00507C]">
                        404 - Page Not Found
                    </p>

                    <div className="flex justify-center mt-4">
                        <Link to={"/"}>
                            <button className="py-2 px-6 bg-blue-500 rounded-full text-white font-bold">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default NotFound;
