import axios from 'axios';
import { API_DEFAULT_HEADERS, API_SERVER_URL } from 'consts';

const api = axios.create({
  baseURL: API_SERVER_URL,
  headers: API_DEFAULT_HEADERS,
});

export default api;
