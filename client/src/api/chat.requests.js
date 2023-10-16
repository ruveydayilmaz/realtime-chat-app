import axios from 'axios'

const API = axios.create({ baseURL: `${import.meta.env.VITE_APP_SERVER_URL}` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).data[0]?.accessToken}`;
  }

  return req;
});

export const createChat = (data) => API.post('/chat/', data);

export const fetchUserChats = () => API.get(`/chat`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);