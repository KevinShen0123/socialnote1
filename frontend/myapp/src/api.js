import axios from 'axios';

const api = axios.create();

// Add a request interceptor
api.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken'); // Replace 'csrftoken' with the actual name of your CSRF token cookie
  config.headers['X-CSRFToken'] = csrftoken;
  return config;
});

// Helper function to get the value of a cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default api;