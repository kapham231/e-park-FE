import { message } from 'antd'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const getVoucher = async (params) => {
  try {
    const qs = new URLSearchParams(params).toString()
    const res = await axios.get(`${baseURL}/voucher?${qs}`)
    return res.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getVoucherById = async (voucherId) => {
  try {
    const res = await axios.get(`${baseURL}/voucher/${voucherId}`)
    return res.data
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}

export const createVoucher = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/voucher/create`, data)
    message.success('Voucher created successfully')
    return res.data
  } catch (err) {
    console.error('Error:', err)
    message.error('Failed to create voucher')
    throw err
  }
}

export const updateVoucher = async (voucherId, data) => {
  try {
    const res = await axios.patch(`${baseURL}/voucher/update/${voucherId}`, data)
    message.success('Voucher updated successfully')
    return res.data
  } catch (error) {
    console.error('Error:', error)
    message.error('Failed to update voucher')
    throw error
  }
}

export const toggleVoucherStatus = async (id, status) => {
  try {
    const res = await axios.post(`${baseURL}/voucher/${status}/${id}`)
    message.success(`Voucher ${status}d successfully`)
    return res.data
  } catch (err) {
    console.error('Error:', err)
    message.error(`Failed to ${status} voucher`)
    throw err
  }
}

export const duplicateVoucher = async (voucherId) => {
  try {
    const res = await axios.post(`${baseURL}/voucher/duplicate/${voucherId}`)
    message.success('Voucher duplicated successfully')
    return res.data
  } catch (err) {
    console.error('Error:', err)
    message.error('Failed to duplicate voucher')
    throw err
  }
}

export const deleteVoucher = async (voucherId) => {
  try {
    const res = await axios.delete(`${baseURL}/voucher/${voucherId}`)
    message.success('Voucher deleted successfully')
    return res.data
  } catch (err) {
    console.error('Error:', err)
    message.error('Failed to delete voucher')
    throw err
  }
}

export const getRedemptions = async (voucherId) => {
  try {
    const res = await axios.get(`${baseURL}/voucher/redemptions/${voucherId}`)
    return res.data
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}
