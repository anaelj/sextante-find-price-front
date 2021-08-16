import axios from "axios";

const apiurl = process.env.API_URL || "https://sextante-find-price.herokuapp.com/"; // "http://localhost:3333";

// console.log(apiurl);
const api = axios.create({
  baseURL: apiurl,
});

export default api;
