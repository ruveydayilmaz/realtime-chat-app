import axios from 'axios'

const API = axios.create({ baseURL: `${import.meta.env.VITE_APP_SERVER_URL}` });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).data[0]?.accessToken}`;
    }

    return req;
});

export const getMessages = (id) => API.get(`/message/${id}?orderAsc=1`);

export const addMessage = (data) => API.post('/message/', data,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
);