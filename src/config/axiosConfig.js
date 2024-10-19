import axios from "axios";

export const serverUrl = "http://localhost:8080/api/v1";

console.log("serverUrl: ", serverUrl);

export const API = axios.create({
    baseURL: `${serverUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});
