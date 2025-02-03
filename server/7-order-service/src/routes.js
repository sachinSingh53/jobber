import{verifyGatewayRequest} from '@sachinsingh53/jobber-shared';
import { healthRoute } from './routes/health.js';
import { orderRoutes } from './routes/order.js';

const BASE_PATH = '/api/v1/order';

const appRoutes = (app)=>{
    app.use('',healthRoute());
    app.use(BASE_PATH,verifyGatewayRequest,orderRoutes());
}

export{appRoutes};