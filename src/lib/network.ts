import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json"
  }
})

// Define a variable to hold the logout callback
let logoutCallback: (() => void) | null = null;

// Function to set the callback from the AuthProvider
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
}

// Request Interceptor (Kept as is - OK)
axiosInstance.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    const token = parsedUser.access
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Uses the callback if available)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized detected via interceptor.");
      if (logoutCallback) {
        logoutCallback(); // Call the logout function from AuthProvider
      } else {
        // Fallback if context hasn't initialized yet
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);