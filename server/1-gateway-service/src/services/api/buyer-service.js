
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosBuyerInstance;

class BuyerService{
    constructor() {
        this.axiosService = new AxiosService(`${config.USER_BASE_URL}/api/v1/buyer`, 'buyer');
        axiosBuyerInstance = this.axiosService.axios;
    }

    async getCurrentBuyerByUsername(){
        const response = await axiosBuyerInstance.get('/username');
        return response;
    }
    async getBuyerByUsername(username){
        const response = await axiosBuyerInstance.get(`/${username}`);
        return response;
    }  
    async getBuyerByEmail(){
        const response = await axiosBuyerInstance.get('/email');
        return response;
    }
}

const buyerService = new BuyerService();

export{axiosBuyerInstance,buyerService};