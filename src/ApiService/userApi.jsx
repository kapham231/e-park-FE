import { message } from 'antd';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;


export const bookingPrice = async (tickets, customerId) => {
    try {
        const response = await axios.post(`${baseURL}ticket/calculateTicketPrice`, {
            tickets: [
                {
                    ticketId: tickets.ticketId,
                    quantity: tickets.quantity,
                    bonus: tickets.bonus
                }
            ],
            customerId
        });
        // console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Invoice 
export const getAllInvoice = async () => {
    try {
        const response = await axios.get(`${baseURL}invoice`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getAllInvoiceWithPaidStatus = async () => {
    try {
        const response = await axios.get(`${baseURL}invoice`);
        const invoices = response.data;
        const paidInvoices = invoices.filter(invoice => invoice.status === "PAID");
        return paidInvoices;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getInvoice = async (invoiceId) => {
    try {
        const response = await axios.get(`${baseURL}invoice/getId/${invoiceId}`);
        // console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const findInvoice = async (orderCode) => {
    try {
        const response = await axios.get(`${baseURL}invoice/find/${orderCode}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const changeInvoiceStatus = async (invoiceId) => {
    try {
        const response = await axios.post(`${baseURL}payment/webhook`, { invoiceId, status: "PAID" });
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateInvoice = async (invoiceId, updatedInvoice) => {
    try {
        const response = await axios.put(`${baseURL}invoice/update/${invoiceId}`, updatedInvoice);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// PAYOS
export const createPayOS = async (invoiceId, cancelUrl, returnUrl) => {
    try {
        // const invoiceId = "67ee9a48ed4d1b666b1f9e8b"
        const response = await axios.post(`${baseURL}payment/create/${invoiceId}`);
        // console.log(response.data);
        // return response.data;
        if (response.data.success) {
            // Chuyển hướng người dùng đến URL thanh toán
            // window.location.href = response.data.data.paymentUrl;
            return response.data.data.paymentUrl;

        } else {
            console.error("Error creating payment:", response.data.message);
            message.error("Failed to create payment. Please try again.");
        }
    } catch (error) {
        console.error("Error creating payment:", error);
        message.error("An error occurred. Please try again.");
    }
}