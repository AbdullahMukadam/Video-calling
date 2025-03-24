import axios from 'axios';
import { Config } from './Config';


const api = axios.create({
  baseURL: Config.baseUrl,
  withCredentials: true
});

export default api;