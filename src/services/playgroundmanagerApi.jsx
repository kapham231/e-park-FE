import axios from 'axios'
import { changeInvoiceStatus } from './userApi'
import { tokenManager } from '../utils/tokenManager'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api/';

// EVENT
export const getAllEvent = async () => {
  try {
    const response = await axios.get(`${baseURL}/event`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getUpcomingEvent = async () => {
  try {
    const response = await axios.get(`${baseURL}/event/upcoming`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getOngoingEvent = async () => {
  try {
    const response = await axios.get(`${baseURL}/event/ongoing`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getEvent = async (id) => {
  console.log(id)

  try {
    const response = await axios.get(`${baseURL}/event/getId/${id}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getEventByDate = async (date) => {
  try {
    const response = await axios.get(`${baseURL}/event/getEventByDate/${date}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createEvent = async (newEvent) => {
  try {
    // console.log('Start Date', newEvent.startDate);
    // console.log('End Date', newEvent.endDate);

    const response = await axios.post(`${baseURL}/event/create`, newEvent)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateEventById = async (eventId, updatedEvent) => {
  // console.log('eventId', eventId);
  // console.log('updatedEvent', updatedEvent);

  try {
    const response = await axios.put(`${baseURL}/event/update/${eventId}`, updatedEvent)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteEventById = async (eventId) => {
  try {
    const response = await axios.delete(`${baseURL}/event/${eventId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// SUPPLIER
export const getAllSupplier = async () => {
  try {
    const response = await axios.get(`${baseURL}/supplier`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getSupplier = async (id) => {
  try {
    if (!id) {
      return
    }
    const response = await axios.get(`${baseURL}/supplier/getId/${id}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createSupplier = async (newSupplier) => {
  try {
    const response = await axios.post(`${baseURL}/supplier/create`, newSupplier)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateSupplierById = async (supplierId, updatedSupplier) => {
  try {
    const response = await axios.put(`${baseURL}/supplier/update/${supplierId}`, updatedSupplier)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteSupplierById = async (supplierId) => {
  try {
    const response = await axios.delete(`${baseURL}/supplier/${supplierId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

//DEVICE
export const getAllDevice = async () => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    // console.log('getAllDevice - branchId:', branchId, 'params:', params)
    const response = await axios.get(`${baseURL}/equipment`, { params })
    // console.log('getAllDevice response:', response.data)
    return response.data
  } catch (error) {
    // console.error('getAllDevice error:', error)
    // console.error('Error response:', error.response?.data)
    throw error
  }
}

export const getDevice = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/equipment/getId/${id}`,{
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getDeviceByStatus = async (status) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    const response = await axios.get(`${baseURL}/equipment/status/${status}`, { params })
    console.log('getDeviceByStatus response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createDevice = async (newDevice) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const devicePayload = branchId ? { ...newDevice, branchId } : newDevice
    console.log('Creating Device with payload:', devicePayload)
    const response = await axios.post(`${baseURL}/equipment/create`, devicePayload)
    // console.log('New Device', response.data);
    // console.log(response.data.data.invoice);

    await changeInvoiceStatus(response.data.data.invoice._id)

    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateDeviceById = async (deviceId, updatedDevice) => {
  try {
    // console.log('deviceId', deviceId);
    // console.log('updatedDevice', updatedDevice);
    const branchId = tokenManager.getUserBranchId()
    const devicePayload = branchId ? { ...updatedDevice, branchId } : updatedDevice

    const response = await axios.put(`${baseURL}/equipment/update/${deviceId}`, devicePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteDeviceById = async (deviceId) => {
  try {
    const response = await axios.delete(`${baseURL}/equipment/${deviceId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getDeviceBySupplierId = async (supplierId) => {
  try {
    const response = await axios.get(`${baseURL}/device/supplier/${supplierId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// DEVICE TYPE
export const getAllType = async () => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    const response = await axios.get(`${baseURL}/typeEquipment`, { params })
    console.log('getAllType response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createType = async (newType) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const typePayload = branchId ? { ...newType, branchId } : newType
    // console.log('Creating Type with payload:', typePayload)
    const response = await axios.post(`${baseURL}/typeEquipment/create`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateTypeById = async (typeId, updatedType) => {
  try {
    // console.log('Type ID:', typeId)
    const branchId = tokenManager.getUserBranchId()
    const typePayload = branchId ? { ...updatedType, branchId } : updatedType

    const response = await axios.put(`${baseURL}/typeEquipment/update/${typeId}`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteTypeById = async (typeId) => {
  try {
    console.log('Deleting Type with ID:', typeId);
    const response = await axios.delete(`${baseURL}/typeEquipment/${typeId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const calculatePriceMaintenanceEquipment = async (deviceId) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const device = await getDevice(deviceId)
    // console.log('device', device);
    const response = await axios.post(`${baseURL}/equipment/calculatePriceMaintenance`, {
      title: `Price Maintenance for ${device.typeName} `,
      supplierId: device.supplierId,
      branchId: branchId,
      equipments: [
        {
          _id: device._id,
          typeName: device.typeName,
          code: device.code,
          maintenancePrice: device.purchasePrice * 0.35 // 35% of purchase price
        }
      ]
    })
    //console.log('Maintainence Bill', response.data.data);
    return response.data.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// PRODUCT TYPE
export const getAllProductType = async () => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    const response = await axios.get(`${baseURL}/typeProduct`, {params}) //Sau sua lai thanh` get type rieng cua product
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createProductType = async (newType) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const typePayload = branchId ? { ...newType, branchId } : newType
    const response = await axios.post(`${baseURL}/typeProduct/create`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateProductTypeById = async (typeId, updatedType) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const typePayload = branchId ? { ...updatedType, branchId } : updatedType
    const response = await axios.put(`${baseURL}/typeProduct/update/${typeId}`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteProductTypeById = async (typeId) => {
  try {
    // console.log('Deleting Product Type with ID:', typeId);

    const response = await axios.delete(`${baseURL}/typeProduct/${typeId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// PRODUCT
export const getAllProduct = async () => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    const response = await axios.get(`${baseURL}/product`, { params })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createProduct = async (newProduct) => {
  try {
    console.log('New Product', newProduct)
    const branchId = tokenManager.getUserBranchId()
    const productPayload = branchId ? { ...newProduct, branchId } : newProduct
    
    const response = await axios.post(`${baseURL}/product/create`, productPayload)
    await changeInvoiceStatus(response.data.data.invoice._id)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateProductById = async (productId, updatedProduct) => {
  try {
    console.log('Product ID:', productId)
    // console.log('Updated Product:', updatedProduct);
    const branchId = tokenManager.getUserBranchId()
    const productPayload = branchId ? { ...updatedProduct, branchId } : updatedProduct
    
    const response = await axios.put(`${baseURL}/product/update/${productId}`, productPayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteProductById = async (productId) => {
  try {
    const response = await axios.delete(`${baseURL}/product/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// TICKET MANAGEMENT
export const getAllTicket = async () => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const params = branchId ? { branchId } : {}
    const response = await axios.get(`${baseURL}/ticket`, { params })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createTicket = async (ticket) => {
  try {
    const branchId = tokenManager.getUserBranchId()
    const ticketPayload = branchId ? { ...ticket, branchId } : ticket
    const response = await axios.post(`${baseURL}/ticket/create`, ticketPayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateTicketbyId = async (ticketId, updatedticket) => {
  try {
    const response = await axios.put(`${baseURL}/ticket/update/${ticketId}`, updatedticket)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const deleteTicketbyId = async (ticketID) => {
  try {
    const response = await axios.delete(`${baseURL}/ticket/${ticketID}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createTicketForNewMember = async (ticket, quantity, bonus) => {
  // console.log(ticket, quantity, bonus);
  try {
    const branchId = tokenManager.getUserBranchId()
    const response = await axios.post(`${baseURL}/ticket/calculateForNewMember`, {
      tickets: [
        {
          ticketId: ticket._id,
          quantity: quantity,
          bonus: bonus
        }
      ]
      , branchId
    })
    console.log(response.data)

    return response.data.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}