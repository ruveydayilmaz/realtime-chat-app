import axios from 'axios'

const API = axios.create({ baseURL: 'http://178.157.15.236:5000' });

export const logIn= (formData)=> API.post('/auth/login',formData);

export const signUp = (formData) => API.post('/auth/register', formData);