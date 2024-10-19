import { Routes, Route, Navigate } from "react-router-dom";
import { AddMember, Dashboard, EditMember, Login, NotFound, Register } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuthToken } from "./store/authSlice";
import DetailMember from "./pages/DetailMember";
function App() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth) || {}; // Ensure it defaults to an empty object
    const { isAuthenticated, loading } = authState;
    console.log("authState: ", authState)
    useEffect(() => {
        dispatch(checkAuthToken());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members/:id" element={<DetailMember />} />
            <Route path="/members/create" element={<AddMember />} />
            <Route path="/members/edit/:id" element={<EditMember />} />
        </Routes>
    );
}

export default App;
