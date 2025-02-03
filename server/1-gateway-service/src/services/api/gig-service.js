
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosGigInstance;

class GigService{
    constructor() {
        this.axiosService = new AxiosService(`${config.GIG_BASE_URL}/api/v1/gig`, 'gig');
        axiosGigInstance = this.axiosService.axios;
    }

    async getGigById(gigId) {
        const response = await axiosGigInstance.get(`/${gigId}`);
        return response;
      }
    
      async getSellerGigs(sellerId) {
        const response = await axiosGigInstance.get(`/seller/${sellerId}`);
        return response;
      }
    
      async getSellerPausedGigs(sellerId) {
        const response = await axiosGigInstance.get(`/seller/pause/${sellerId}`);
        return response;
      }
    
      async getGigsByCategory(username) {
        const response = await axiosGigInstance.get(`/category/${username}`);
        return response;
      }
    
      async getMoreGigsLikeThis(gigId) {
        const response = await axiosGigInstance.get(`/similar/${gigId}`);
        return response;
      }
    
      async getTopRatedGigsByCategory(username) {
        const response = await axiosGigInstance.get(`/top/${username}`);
        return response;
      }
    
      async searchGigs(query, from, size, type) {
        const response = await axiosGigInstance.get(`/search/${from}/${size}/${type}?${query}`);
        return response;
      }
    
      async createGig(body) {
        const response = await axiosGigInstance.post('/create', body);
        return response;
      }
    
      async updateGig(gigId, body) {
        const response = await axiosGigInstance.put(`/${gigId}`, body);
        return response;
      }
    
      async deleteGig(gigId, sellerId) {
        const response= await axiosGigInstance.delete(`/${gigId}/${sellerId}`);
        return response;
      }
    
      async updateActiveGigProp(gigId, isActive) {
        const response = await axiosGigInstance.put(`/active/${gigId}`, { isActive });
        return response;
      }
    
      async seed(count) {
        const response = await axiosGigInstance.put(`/seed/${count}`);
        return response;
      }

}

const gigService = new GigService();

export{axiosGigInstance,gigService};