import axios from "axios"
import { BASE_URL } from "./config"



const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

const axiosError = (error) => {
    if (error?.response?.status === 403) {
        localStorage.clear()
        window.location.href = '/signIn'
    } else{
        return error
    }
}
axiosInstance.interceptors.response.use(response => response, error => axiosError(error))

export const login = async (params) => {
    return await axiosInstance.post(`auth/adminLogin`, params)
}

export const dashboard = async () => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`dashboard/dashboardDetails`)
}

export const categoryList = async () => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`category/listCategories`)
}
export const editCategory = async (param) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.put(`category/editCategory`, param)
}


export const addCategory = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.post(`category/addCategory`, params)
}

export const logout = () => {
    axiosInstance.defaults.headers['Authorization'] = ''
    localStorage.clear()
}