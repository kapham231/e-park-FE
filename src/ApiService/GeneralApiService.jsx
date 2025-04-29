import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;


export const UserLogin = async (username, password) => {
    try {
        const response = await axios.post(`${baseURL}/generalUser/login`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


