
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosReviewInstance;

class ReviewService {
    constructor() {
        this.axiosService = new AxiosService(`${config.REVIEW_BASE_URL}/api/v1/review`, 'review');
        axiosReviewInstance = this.axiosService.axios;
    }

    async getReviewByGigId(gigId) {
        const response = await axiosReviewInstance.get(`/gig/${gigId}`);
        return response;
    }

    async getReviewBySellerId(sellerId){
        const response = await axiosReviewInstance.get(`/seller/${sellerId}`);
        return response;
    }

    async createReview(data){
        const response = await axiosReviewInstance.post(`/`,data);
        return response;
    }

}

const reviewService = new ReviewService();

export { axiosReviewInstance, reviewService };