import axios from  "axios"

export const getDataAPI = async (url, token) => {
    const response = await axios.get(`/api/${url}`, {
        headers : { Authorization : token}
    })
    return response;
}

export const postDataAPI = async (url, post, token) => {
    const response = await axios.post(`/api/${url}`, post,{
        headers : { Authorization : token}
    })
    return response;
}

export const putDataAPI = async (url, post, token) => {
    const response = await axios.put(`/api/${url}`, post,{
        headers : { Authorization : token}
    })
    return response;
}

export const patchDataAPI = async (url, post, token) => {
    const response = await axios.patch(`/api/${url}`, post,{
        headers : { Authorization : token}
    })
    return response;
}

export const deleteDataAPI = async (url, token) => {
    const response = await axios.delete(`/api/${url}`,{
        headers : { Authorization : token}
    })
    return response;
}