const axios = require("axios");


axios.defaults.headers.common['x-auth-token'] = localStorage.getItem("token");

axios.interceptors.response.use(null, error => {
    if (error.response && error.response.status === 500) {
        console.log(error)
    }
    return Promise.reject(error)
})


const httpService = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete

}
export default httpService;


