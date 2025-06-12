import axios from 'axios';

const api = axios.create({
  // ao usar o emulador, deverá colocar o IP do mesmo no lugar do 'localhost'
  baseURL: 'http://192.168.10.13:8081'
});

export default api;