import axios from 'axios';

const api = axios.create({
  // ao usar o emulador, deverá colocar o IP do mesmo no lugar do 'localhost'
  baseURL: 'https://192.168.31.134:8081/'
});

export default api;