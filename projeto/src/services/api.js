import axios from 'axios';

const api = axios.create({
  // ao usar o emulador, deverá colocar o IP do mesmo no lugar do 'localhost'
  baseURL: 'https://localhost:8080/'
});

export default api;