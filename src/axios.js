import axios from 'axios';
import authHeader from './services/auth-header';
// import _ from 'lodash';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // withCredentials: true
});

// const user = JSON.parse(localStorage.getItem('user'));
// instance.defaults.headers.common['x-access-token'] = user.accessToken;

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;

        return response.data;
    },
);

export default instance;
