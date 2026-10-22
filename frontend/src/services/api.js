
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "The server took too long to respond. Please try again.";
    } else if (!error.response) {
      error.message =
        "Cannot connect to the server. Please check that the Spring Boot backend is running on port 8080.";
    }

    return Promise.reject(error);
  }
);

export default api;
