import{verifyGatewayRequest} from '@sachinsingh53/jobber-shared'
import { gigRoutes } from "./routes/gig.js";
import healthRoute from './routes/health.js'
const BASE_PATH = '/api/v1/gig';

const appRoutes = (app)=>{
    app.use(BASE_PATH,verifyGatewayRequest,gigRoutes());
    app.use('',healthRoute);
}

export{appRoutes};