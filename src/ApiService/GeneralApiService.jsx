import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

console.log(baseURL)

export const UserLogin = async (username, password) => {
  try {
    const response = await axios.post(`${baseURL}/generalUser/login`, {
      username,
      password
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
