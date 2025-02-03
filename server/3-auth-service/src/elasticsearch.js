import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import config from './config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection() {
    let isConnected = false;
    while (!isConnected) {
        log.info('AuthService connecting to ElasticSearch...');
        try {
            const health = await elasticSearchClient.cluster.health({});
            log.info(`AuthService Elasticsearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error','AuthService checkConnection() method:', error);
        }
    }
}
//in elasticsearch the index is the actual table that will store data.
async function checkIfIndexExist(indexName) {
    return await elasticSearchClient.indices.exists({ index: indexName });
}

async function createIndex(indexName) {
    try {
        const result = await  checkIfIndexExist(indexName);
        if (result) {
            log.info(`Index ${indexName} already exist`);
        } else{
            await elasticSearchClient.indices.create({index:indexName});
            await elasticSearchClient.indices.refresh({index:indexName});
            log.info(`Created index ${indexName}`);
        }
    } catch (error) {
        log.error(`An error occured while creating the index ${indexName}`);
        log.error('error','AuthService createIndex() method:', error);
    }
}

async function getDoccumentById(indexName,gigId){
    try {
        const result = await elasticSearchClient.get({
            index: indexName,
            id:gigId
        })
        
        return result._source;
    } catch (error) {
        log.error('error','AuthService getDoccumentById() method:', error);
        return {};
    }
}

async function gigsSearch(
    searchQuery,
    paginate,
    deliveryTime,
    min,
    max
){
    const {from,size,type} = paginate;

    const queryList = [
        {
            query_string: {
                fields: ['username','title','description','basicDescription','basicTitle','categories','subCategories','tags'],
                query: `*${searchQuery}*`
            }
        },
        {
            term:{
                //this is for active gigs
                active: true
            }
        }
    ];
    // these are optional only being used when user wants to filter gigs
    if(deliveryTime!=='undefined'){
        queryList.push({
            query_string:{
                fields:['expectedDelivery'],
                query: `*${deliveryTime}*`
            }
        });
    }

    if(!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))){
        queryList.push({
            range:{
                price:{
                    gte:min,
                    lte:max
                }
            }
        });
    }

    const result = await elasticSearchClient.search({
        index: 'gigs',
        size,
        query:{
            bool:{
                must: [...queryList]
            }
        },

        sort:[
            {
                sortId: type === 'forward' ? 'asc' : 'desc'
            }
        ],

        // ... it is an conditional object
        ...(from !== '0' && {search_after: [from] }) // this is used for pagination, the elasticsearch will search after the from number 
        
    })

    return {
        total: result.hits.total.value,
        hits: result.hits.hits
    }
}

export { 
    elasticSearchClient,
    checkConnection,
    createIndex,
    getDoccumentById,
    gigsSearch
};
