// import{verifyGatewayRequest} from '../../9-jobber-shared/src/gateway-middleware.js';
import{verifyGatewayRequest} from '@sachinsingh53/jobber-shared';
import { healthRoutes } from './routes/health.js';
import { reviewRoutes } from './routes/review.js';

const BASE_PATH = '/api/v1/review';

const appRoutes = (app)=>{
    app.use('',healthRoutes());
    app.use(BASE_PATH,verifyGatewayRequest,reviewRoutes());
}

export{appRoutes};