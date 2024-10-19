import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { API } from "../config/axiosConfig";
import { Bounce, toast, ToastContainer } from "react-toastify";

const { Search } = Input;

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/"); // Redirect to login page
    };

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        if (!name) {
            navigate("/");
        } else {
            loadMembers();
        }
    }, [name]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const resp = await API.get("/member");
            // Pastikan response.data adalah array
            if (Array.isArray(resp.data)) {
                setMembers(resp.data);
                setFilteredMembers(resp.data);
            } else {
                console.error(
                    "Expected response.data to be an array, but got:",
                    resp.data
                );
                setMembers([]); // set members ke array kosong
                setFilteredMembers([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this member?",
            onOk: async () => {
                try {
                    const resp = await API.delete(`/member/${id}`);
                    console.log("resp: ", resp);
                    toast.success("Member deleted successfully.");
                    loadMembers();
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to delete member.");
                }
            },
        });
    };

    const handleSearch = (value) => {
        const filtered = members.filter(
            (member) =>
                member.name.toLowerCase().includes(value.toLowerCase()) ||
                member.position.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredMembers(filtered);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <div className="flex justify-center">
                    <Button
                        onClick={() => navigate(`/members/${record.id}`)}
                        className="me-2"
                    >
                        Detail
                    </Button>
                    <Button
                        onClick={() => navigate(`/members/edit/${record.id}`)}
                        className="me-2"
                    >
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record.id)} danger>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="h-screen p-8">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-4xl">Dashboard</h1>
                    </div>
                    <div className="flex items-center">
                        <p className="me-2">
                            Hi, <span className="font-bold">{name}</span>
                        </p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-700 font-bold text-white px-6 py-2 rounded-full"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between mb-4">
                        <Search
                            placeholder="Search members..."
                            onSearch={handleSearch}
                            enterButton
                            allowClear
                            style={{ width: 300 }}
                        />
                        <Button
                            type="primary"
                            onClick={() => navigate("/members/create")}
                        >
                            Add Member
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredMembers}
                        loading={loading}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
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
        </>
    );
};

export default Dashboard;
