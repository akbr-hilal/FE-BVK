import { Routes, Route } from "react-router-dom";
import { Login, NotFound, Register } from "./pages";
function App() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App;
