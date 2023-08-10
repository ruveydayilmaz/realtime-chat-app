import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_APP_SERVER_URL });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
);