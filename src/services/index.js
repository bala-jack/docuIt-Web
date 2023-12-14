import axios from "axios"
import { BASE_URL } from "./config"
import { useAuth } from "context/AuthContext"



const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'AllowedOrigin': '*',
        'X-Requested-With': 'XMLHttpRequest',
    }
})

const axiosUpload = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'accept': '*/*',
        'AllowedOrigin': '*',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

const axiosAuthInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'AllowedOrigin': '*',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

axiosAuthInstance.interceptors.request.use(config => axiosRequest(config))


const axiosRequest = (config) => {
    const token = localStorage.getItem('docuItToken')
    console.log('config', config)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
}
const axiosError = (error) => {
    if (error?.response?.status === 403) {
        localStorage.clear()
        window.location.href = '/signIn'
    } else {
        return error
    }
}
axiosInstance.interceptors.response.use(response => response, error => axiosError(error))

export const login = async (params) => {
    return await axiosInstance.post(`auth/login`, params)
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

// david code starts here

export const register = async (params) => {
    return await axiosInstance.post(`auth/signUp`, params)
}

export const verify = async (params) => {
    return await axiosInstance.post(`auth/verifyEmail`, params)
}

export const resend = async (params) => {
    return await axiosInstance.post(`auth/resendCode?email=` + params)
}

export const setpin = async (params) => {
    return await axiosInstance.post(`auth/pinGeneration`, params)
}

export const forgetpin = async (params) => {
    return await axiosInstance.post(`auth/forgotPin?phoneNumber=` + params)
}

// Praveen code 

export const listFamily = async (param) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`family/listFamily?adminId=` + param);
}

export const addFamily = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.post(`family/addFamily`, params);
}

export const editFamily = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.put(`family/editFamily`, params);
}

export const deleteFamily = async (params) => {
    // const token = localStorage.getItem('docuItToken')
    // if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
    //     axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    // }
    return await axiosAuthInstance.delete(`family/deleteFamily`, { data: params });
}

export const listFamilyMembers = async (param) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`family/listFamilyMembers?familyId=` + param);
}
export const removeFamilyMembers = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`family/removeFamilyMembers`, params);
}
export const inviteUser = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.post(`family/inviteUser`, params);
}

export const listPendingInvites = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`family/listPendingInvites?userId=` + params);
}

export const acceptInvite = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.post(`/family/acceptInvite`, params);
}

export const findUser = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`category/find/user/` + params);
}

export const UsercategoryList = async (params) => {
    const userId = params.userId;
    const categoryId = params.categoryId;
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`category/find/user/${userId}/category/${categoryId}`);
}

export const uploadDocuments = async (userId, param) => {

    const token = localStorage.getItem('docuItToken')
    if (token && axiosUpload.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosUpload.defaults.headers['Content-Type'] = 'multipart/form-data';
        axiosUpload.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosUpload.post(`document/uploadDocument?userId=${userId}`, param);
}

export const saveDocuments = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.post(`document/saveDocument`, params);
}

// Integration

export const userdashboard = async (params) => {
    const token = localStorage.getItem('docuItToken')
    if (token && axiosInstance.defaults.headers['Authorization'] !== `Bearer ${token}`) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return await axiosInstance.get(`document/getUserLastDocumentActivity?userId=` + params);
}

