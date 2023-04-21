import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios';

import store, { persistor } from './store'
import App from './components/App';
import { BASE_URL } from './constants';


const handleUnauthorizedError = async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      // send cookies with 'refresh token' to refresh 'access token'
      const response = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, null, { withCredentials: true });
      const accessToken = response.data.access;
      // save access token in localStorage
      localStorage.setItem('access_token', accessToken);
      // add access token to request headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return axios(originalRequest);
    } catch (err) {
      // remove access token from localStorage
      localStorage.removeItem('access_token');
      // redirect user to login page
      window.location.href = '/users/login';
      return Promise.reject(err);
    }
  }
  return Promise.reject(error);
};

axios.interceptors.request.use(
  config => {
    // get access token from localStorage
    const accessToken = localStorage.getItem('access_token')

    if (accessToken) {
      // add access token to request headers
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

axios.interceptors.response.use(
  response => response,
  handleUnauthorizedError
);

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
