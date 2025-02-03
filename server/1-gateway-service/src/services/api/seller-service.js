
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosSellerInstance;

class SellerService{
    constructor() {
        this.axiosService = new AxiosService(`${config.USER_BASE_URL}/api/v1/seller`, 'seller');
        axiosSellerInstance = this.axiosService.axios;
    }

    async getSellerById(sellerId){
        const response = await axiosSellerInstance.get(`/id/${sellerId}`);
        return response;
    }
    async getSellerByUsername(username){
        const response = await axiosSellerInstance.get(`/username/${username}`);
        return response;
    }
    async getRandomSellers(count){
        const response = await axiosSellerInstance.get(`/random/${count}`);
        return response;
    }
    async createSeller(body){
        const response = await axiosSellerInstance.post('/create',body);
        return response;
    }
    async updateSeller(sellerId,body){
        const response = await axiosSellerInstance.put(`/${sellerId}`,body);
        return response;
    }
    async seed(count){

        const response = await axiosSellerInstance.post(`/seed/${count}`);
        return response;
    }
}

const sellerService = new SellerService();

export{axiosSellerInstance,sellerService};