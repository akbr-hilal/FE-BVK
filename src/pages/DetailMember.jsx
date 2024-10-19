import { useNavigate, useParams } from "react-router-dom";
import { API } from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { Button, Card } from "antd";

const DetailMember = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadMember();
    }, [id]);

    const loadMember = async () => {
        try {
            const resp = await API.get(`/member/${id}`);
            console.log("data: ", resp);
            if (resp.status === 200) {
                setMember(resp.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!member) {
        return <div>Loading...</div>;
    }
    return (
        <div className="h-screen p-8">
            <h1 className="text-4xl">Detail Member</h1>
            <div className="p-6 flex justify-center">
                <Card
                    style={{ width: 300 }}
                    cover={
                        <img
                            alt={member.name}
                            src={`data:image/*;base64,${member.pictureBase64}`}
                            style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                            }}
                        />
                    }
                    actions={[
                        <Button
                            key={member.id}
                            type="primary"
                            onClick={() =>
                                navigate(`/members/edit/${member.id}`)
                            }
                        >
                            Edit
                        </Button>,
                        <Button
                            key={member.id}
                            danger
                            onClick={() => navigate("/dashboard")}
                        >
                            Back
                        </Button>,
                    ]}
                >
                    <Card.Meta
                        title={member.name}
                        description={
                            <>
                                <p>
                                    <strong>Position:</strong> {member.position}
                                </p>
                                <p>
                                    <strong>Reports To:</strong>{" "}
                                    {member.reportsTo}
                                </p>
                            </>
                        }
                    />
                </Card>
            </div>
        </div>
    );
};

export default DetailMember;
