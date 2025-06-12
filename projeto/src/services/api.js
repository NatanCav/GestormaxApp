import axios from 'axios';

const api = axios.create({
  // ao usar o emulador, deverá colocar o IP do mesmo no lugar do 'localhost'
  baseURL: 'http://192.168.31.134:8080//'
});

export default api;