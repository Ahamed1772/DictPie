import { axiosInstance } from './axios.js'

//credential routes
export const signUp = async (signUpData) => {
    const response = await axiosInstance.post('/auth/signup', signUpData);
    return response
}

export const login = async (loginData) => {
    const response = await axiosInstance.post('/auth/login', loginDataData);
    return response
}

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response
}

export const verifyUser = async (verifyData) => {
    const response = await axiosInstance.post('/auth/verify/user', verifyData);
    return response
}
