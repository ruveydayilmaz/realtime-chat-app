import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_APP_SERVER_URL });

export const createChat = (data) => API.post('/chat/', data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);