import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../config/axiosConfig";
import { getBase64 } from "../utils/getBase64";
import { FaUpload } from "react-icons/fa6";

const AddMember = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pictureBase64, setPictureBase64] = useState(null);
    const navigate = useNavigate();

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const member = {
                ...values,
                pictureBase64,
            };
            console.log("member: ", member)
            await API.post("/member", member);
            toast.success("Member created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create member.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        try {
            const base64 = await getBase64(file);
            console.log("base64Img: ", base64)
            setPictureBase64(base64);
            return false; // Prevent default upload behavior
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload picture.");
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };
    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Add Member</h1>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the position",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Reports To" name="reportsTo">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Picture"
                        name="picture"
                        rules={[
                            {
                                required: true,
                                message: "Please upload a picture",
                            },
                        ]}
                    >
                        <Upload
                            beforeUpload={handleUpload}
                            accept="image/*"
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<FaUpload />}>Click to Upload</Button>
                        </Upload>
                        {pictureBase64 && (
                            <img
                                src={`data:image/*;base64,${pictureBase64}`}
                                alt="Uploaded"
                                className="mt-4"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Submit
                        </Button>
                        <Button
                            type="default"
                            htmlType="button"
                            loading={loading}
                            onClick={handleBack}
                            className="ms-4"
                        >
                            Back
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default AddMember;
