
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosAuthInstance;

class AuthService {
    
    constructor() {
        this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');
        axiosAuthInstance = this.axiosService.axios;
    }

    async getCurrentUser() {
        const response = await axiosAuthInstance.get('/currentuser');
        return response;
    }

    async getRefreshToken(username) {
        const response = await axiosAuthInstance.get(`/refresh-token/${username}`);
        return response;
    }

    async changePassword(currentPassword, newPassword) {
        const response = await axiosAuthInstance.put('/change-password', { currentPassword, newPassword });
        return response;
    }

    async verifyEmail(token) {
        const response = await axiosAuthInstance.put('/verify-email', { token });
        return response;
    }

    async resendEmail(data) {
        const response = await axiosAuthInstance.post('/resend-email', data);
        return response;
    }

    async signUp(body) {
        const response = await this.axiosService.axios.post('/signup', body);
        return response;
    }

    async signIn(body) {
        const response = await this.axiosService.axios.post('/signin', body);
        return response;
    }

    async forgotPassword(email) {
        const response = await this.axiosService.axios.put('/forgot-password', { email });
        return response;
    }

    async resetPassword(token, password, confirmPassword) {
        const response = await this.axiosService.axios.put(`/reset-password/${token}`, { password, confirmPassword });
        return response;
    }

    async getGigs(query, from, size, type) {
        const response = await this.axiosService.axios.get(`/search/gig/${from}/${size}/${type}?${query}`);
        return response;
    }

    async getGig(gigId) {
        const response = await this.axiosService.axios.get(`/search/gig/${gigId}`);
        return response;
    }

    async seed(count) {
        const response = await this.axiosService.axios.put(`/seed/${count}`);
        return response;
    }

}
const authService = new AuthService();

export { authService, axiosAuthInstance };
