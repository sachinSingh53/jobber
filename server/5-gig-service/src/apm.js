// apm.js
import apm from 'elastic-apm-node';

// Initialize the agent
if(process.env.ENABLE_APM==='1'){
    apm.start({
        serviceName: 'jobber-gig',
        secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
        serverUrl: process.env.ELASTIC_APM_SERVER_URL,
        environment: process.env.NODE_ENV,
        active: true,
        captureBody:'all',
        errorOnAbortedRequests: true,
        captureErrorLogStackTraces: 'always'
    });
}

export default apm;
