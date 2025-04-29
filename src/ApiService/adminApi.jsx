import axios from 'axios';

const baseURL = 'http://localhost:3333/api/';

// USER MANAGEMENT
export const getAllUserWithRole = async () => {
    try {
        const response = await axios.get(`${baseURL}generalUser`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getUserNameById = async (userId) => {
    try {
        const response = await axios.get(`${baseURL}generalUser/getId/${userId}`);
        console.log(response.data.data);

        return response.data.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const addUserWithRole = async (user) => {
    // console.log(user);
    const formattedUser = {
        username: user.username,
        password: user.password,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
    };

    // Thêm Position cho Staff và Manager
    if (user.role === 'PlaygroundManager') {
        formattedUser.position = user.position;
    }

    try {
        const response = await axios.post(`${baseURL}generalUser/create`, formattedUser);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateUserbyId = async (user, userId) => {
    // console.log(user, userId);

    const formattedUser = {
        username: user.username,
        password: user.password,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
    };

    // Thêm Position cho Staff và Manager
    if (user.role === 'PlaygroundManager') {
        formattedUser.position = user.position;
    }

    try {
        const response = await axios.put(`${baseURL}generalUser/update/${userId}`, formattedUser);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteUserbyId = async (userId) => {
    try {
        const response = await axios.delete(`${baseURL}generalUser/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// TICKET MANAGEMENT
export const getAllTicket = async () => {
    try {
        const response = await axios.get(`${baseURL}ticket`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createTicket = async (ticket) => {
    try {
        const response = await axios.post(`${baseURL}ticket/create`, ticket);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateTicketbyId = async (ticketId, updatedticket) => {
    try {
        const response = await axios.put(`${baseURL}ticket/update/${ticketId}`, updatedticket);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteTicketbyId = async (ticketID) => {
    try {
        const response = await axios.delete(`${baseURL}ticket/${ticketID}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createTicketForNewMember = async (ticket, quantity, bonus) => {
    // console.log(ticket, quantity, bonus);
    try {
        const response = await axios.post(`${baseURL}ticket/calculateForNewMember`, {
            tickets: [{
                "ticketId": ticket._id,
                "quantity": quantity,
                "bonus": bonus
            }]
        });
        console.log(response.data);

        return response.data.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
