import axios from 'axios'

const API = axios.create({ baseURL: 'http://178.157.15.236:5000' });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);