import axios from 'axios';
import { changeInvoiceStatus } from './userApi';

const baseURL = process.env.REACT_APP_API_BASE_URL;


// EVENT
export const getAllEvent = async () => {
    try {
        const response = await axios.get(`${baseURL}/event`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getUpcomingEvent = async () => {
    try {
        const response = await axios.get(`${baseURL}/event/upcoming`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getOngoingEvent = async () => {
    try {
        const response = await axios.get(`${baseURL}/event/ongoing`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getEvent = async (id) => {
    console.log(id);

    try {
        const response = await axios.get(`${baseURL}/event/getId/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getEventByDate = async (date) => {
    try {
        const response = await axios.get(`${baseURL}/event/getEventByDate/${date}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createEvent = async (newEvent) => {
    try {
        // console.log('Start Date', newEvent.startDate);
        // console.log('End Date', newEvent.endDate);


        const response = await axios.post(`${baseURL}/event/create`, newEvent);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateEventById = async (eventId, updatedEvent) => {
    // console.log('eventId', eventId);
    // console.log('updatedEvent', updatedEvent);

    try {
        const response = await axios.put(`${baseURL}/event/update/${eventId}`, updatedEvent);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteEventById = async (eventId) => {
    try {
        const response = await axios.delete(`${baseURL}/event/${eventId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// SUPPLIER
export const getAllSupplier = async () => {
    try {
        const response = await axios.get(`${baseURL}/supplier`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getSupplier = async (id) => {
    try {
        if (!id) {
            return;
        }
        const response = await axios.get(`${baseURL}/supplier/getId/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createSupplier = async (newSupplier) => {
    try {
        const response = await axios.post(`${baseURL}/supplier/create`, newSupplier);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateSupplierById = async (supplierId, updatedSupplier) => {
    try {
        const response = await axios.put(`${baseURL}/supplier/update/${supplierId}`, updatedSupplier);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteSupplierById = async (supplierId) => {
    try {
        const response = await axios.delete(`${baseURL}/supplier/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

//DEVICE
export const getAllDevice = async () => {
    try {
        const response = await axios.get(`${baseURL}/equipment`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getDevice = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/equipment/getId/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getDeviceByStatus = async (status) => {
    try {
        const response = await axios.get(`${baseURL}/equipment/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createDevice = async (newDevice) => {
    try {
        const response = await axios.post(`${baseURL}/equipment/create`, newDevice);
        // console.log('New Device', response.data);
        // console.log(response.data.data.invoice);


        await changeInvoiceStatus(response.data.data.invoice._id);

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateDeviceById = async (deviceId, updatedDevice) => {
    try {
        // console.log('deviceId', deviceId);
        // console.log('updatedDevice', updatedDevice);

        const response = await axios.put(`${baseURL}/equipment/update/${deviceId}`, updatedDevice);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteDeviceById = async (deviceId) => {
    try {
        const response = await axios.delete(`${baseURL}/equipment/${deviceId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getDeviceBySupplierId = async (supplierId) => {
    try {
        const response = await axios.get(`${baseURL}/device/supplier/${supplierId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// DEVICE TYPE
export const getAllType = async () => {
    try {
        const response = await axios.get(`${baseURL}/type`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const createType = async (newType) => {
    try {
        const response = await axios.post(`${baseURL}/type/create`, newType);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const updateTypeById = async (typeId, updatedType) => {
    try {
        const response = await axios.put(`${baseURL}/type/update/${typeId}`, updatedType);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const deleteTypeById = async (typeId) => {
    try {
        const response = await axios.delete(`${baseURL}/type/${typeId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const calculatePriceMaintenanceEquipment = async (deviceId) => {
    try {
        const device = await getDevice(deviceId);
        // console.log('device', device);
        const response = await axios.post(`${baseURL}/equipment/calculatePriceMaintenance`, {
            "title": `Price Maintenance for ${device.typeName} `,
            "supplierId": device.supplierId,
            "equipments": [{
                "_id": device._id,
                "typeName": device.typeName,
                "code": device.code,
                "maintenancePrice": device.purchasePrice * 0.35, // 35% of purchase price
            }],
        });
        //console.log('Maintainence Bill', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}