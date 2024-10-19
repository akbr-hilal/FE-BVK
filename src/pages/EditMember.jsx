import { Button, Form, Input, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBase64 } from "../utils/getBase64";
import { API } from "../config/axiosConfig";
import { FaUpload } from "react-icons/fa6";

const EditMember = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pictureBase64, setPictureBase64] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadMember();
    }, [id]);

    const loadMember = async () => {
        try {
            setLoading(true);
            const resp = await API.get(`/member/${id}`);
            form.setFieldsValue({
                name: resp.data.name,
                position: resp.data.position,
                reportsTo: resp.data.reportsTo,
            });
            setPictureBase64(resp.data.pictureBase64);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load member.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const member = {
                ...values,
                pictureBase64,
            };
            console.log("member: ", member);
            await API.put(`/member/${id}`, member);
            toast.success("Member updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update member.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        try {
            const base64 = await getBase64(file);
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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Member</h1>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please enter the name" },
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
                            validator: (_, value) => {
                                // Jika tidak ada gambar baru, izinkan tanpa validasi
                                if (!pictureBase64) {
                                    return Promise.reject(
                                        new Error("Please upload a picture")
                                    );
                                }
                                return Promise.resolve();
                            },
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
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
    );
};

export default EditMember;
