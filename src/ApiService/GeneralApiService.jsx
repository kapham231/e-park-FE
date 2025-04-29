import axios from 'axios';

const baseURL = 'http://localhost:3001/api/';

export const UserLogin = async (username, password) => {
    try {
        const response = await axios.post(`${baseURL}users/login`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


