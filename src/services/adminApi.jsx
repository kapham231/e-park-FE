import axios from 'axios'

// const baseURL = 'http://localhost:3333/api/';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api/';

// USER MANAGEMENT
export const getAllUserWithRole = async () => {
  try {
    const response = await axios.get(`${baseURL}/generalUser`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getUserNameById = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/generalUser/getId/${userId}`)
    // console.log(response.data.data)

    return response.data.data
  } catch (error) {
    console.error('Error:', error)
    throw error
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
    gender: user.gender
  }

  // Thêm Position cho Staff và Manager
  if (user.role === 'PlaygroundManager') {
    formattedUser.position = user.position
  }

  // Thêm branchId nếu có
  if (user.branchId) {
    formattedUser.branchId = user.branchId
  }

  try {
    const response = await axios.post(`${baseURL}/generalUser/create`, formattedUser)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

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
    gender: user.gender
  }

  // Thêm Position cho Staff và Manager
  if (user.role === 'PlaygroundManager') {
    formattedUser.position = user.position
  }

  try {
    const response = await axios.put(`${baseURL}/generalUser/update/${userId}`, formattedUser)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const handleRecoverPassword = async (username, password) => {
  try {
    console.log('Vao day roi` ne`')

    const response = await axios.post(`${baseURL}/generalUser/forgot-password`, {
      username: username,
      password: password
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const deleteUserbyId = async (userId) => {
  try {
    const response = await axios.delete(`${baseURL}/generalUser/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${baseURL}/generalUser/staffs`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getManagerToAddBranch = async () => {
  try {
    const response = await axios.get(`${baseURL}/generalUser/getManagerToAddBranch`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// TICKET MANAGEMENT
export const getAllTicket = async () => {
  try {
    const response = await axios.get(`${baseURL}/ticket`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createTicket = async (ticket) => {
  try {
    const response = await axios.post(`${baseURL}/ticket/create`, ticket)
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
    const response = await axios.post(`${baseURL}/ticket/calculateForNewMember`, {
      tickets: [
        {
          ticketId: ticket._id,
          quantity: quantity,
          bonus: bonus
        }
      ]
    })
    console.log(response.data)

    return response.data.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

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
    const response = await axios.get(`${baseURL}/equipment`)
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
    const response = await axios.get(`${baseURL}/equipment/status/${status}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createDevice = async (newDevice) => {
  try {
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
    const response = await axios.get(`${baseURL}/typeEquipment`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createType = async (newType) => {
  try {
    const response = await axios.post(`${baseURL}/typeEquipment/create`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateTypeById = async (typeId, updatedType) => {
  try {
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
    const response = await axios.post(`${baseURL}/equipment/calculatePriceMaintenance`, {
      title: `Price Maintenance for ${device.typeName} `,
      supplierId: device.supplierId,
      branchId: device.branchId,
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
    const response = await axios.get(`${baseURL}/typeProduct`) //Sau sua lai thanh` get type rieng cua product
    // console.log('getAllProductType response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createProductType = async (newType) => {
  try {
    const response = await axios.post(`${baseURL}/typeProduct/create`, typePayload)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateProductTypeById = async (typeId, updatedType) => {
  try {
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
    const response = await axios.get(`${baseURL}/product`, { params })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const createProduct = async (newProduct) => {
  try {
    const response = await axios.post(`${baseURL}/product/create`)
    await changeInvoiceStatus(response.data.data.invoice._id)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateProductById = async (productId, updatedProduct) => {
  try {
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

// BRANCH
export const getAllBranch = async () => {
  try {
    const response = await axios.get(`${baseURL}/branch`)
    // console.log('getAllBranch response:', response.data)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const getBranch = async (id) => {
  try {
    if (!id) {
      return
    }
    const response = await axios.get(`${baseURL}/branch/getId/${id}`)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const createBranch = async (newBranch) => {
  try {
    console.log('Creating Branch with payload:', newBranch)
    const response = await axios.post(`${baseURL}/branch/create`, newBranch)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const updateBranchById = async (updatedBranch, branchId) => {
  try {
    const response = await axios.put(`${baseURL}/branch/update/${branchId}`, updatedBranch)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const deleteBranch = async (branchId) => {
  try {
    // console.log('Deleting Branch with ID:', branchId);
    const response = await axios.delete(`${baseURL}/branch/${branchId}`)  
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const transferBranch = async (userId, newBranchId) => {
  let returnedBranchId = newBranchId

  try {

    const response = await axios.put(`${baseURL}/branch/transferBranch`, {
      userId: userId,
      newBranchId: newBranchId
    })
    // Check if the response contains an error message
    if (response.data && response.data.message === 'New branch not found') {
      console.error('API returned error message:', response.data.message)
      // Keep the default returnedBranchId (newBranchId)
    } else {
      // Return the branchId that was assigned, or extract it from response if available
      returnedBranchId = response.data.branchId || response.data.data?.branchId || newBranchId
    }

    console.log('Returning branchId:', returnedBranchId)
  } catch (error) {
    console.error('transferBranch error details:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error message:', error.message)

    // Even if the API call fails, use the branchId that was attempted to be assigned
    // This allows the UI to update optimistically
    console.log('Using attempted branchId despite error:', returnedBranchId)
  }

  return returnedBranchId
}

export const getUsersByBranchId = async (branchId) => {
  try {
    const response = await axios.get(`${baseURL}/branch/users/${branchId}`)
    console.log('API - Users by Branch ID response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const addUserToBranch = async (userId, branchId) => {
  try {
    const response = await axios.post(`${baseURL}/branch/addUser`, {
      userId: userId,
      branchId: branchId
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}



