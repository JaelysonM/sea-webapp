import axios from 'axios';
import { API_DEFAULT_HEADERS, API_SERVER_URL } from 'consts';

export default axios.create({
  baseURL: API_SERVER_URL,
  headers: API_DEFAULT_HEADERS,
});
