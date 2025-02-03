import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import config from './config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'gigElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection() {
    let isConnected = false;
    while (!isConnected) {
        log.info('gigService connecting to ElasticSearch...');
        try {
            const health = await elasticSearchClient.cluster.health({});
            log.info(`gigService Elasticsearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'gigService checkConnection() method:', error);
        }
    }
}

async function checkIfIndexExist(indexName) {
    return await elasticSearchClient.indices.exists({ index: indexName });
}

async function createIndex(indexName) {
    try {
        const result = await checkIfIndexExist(indexName);
        if (result) {
            log.info(`Index ${indexName} already exist`);
        } else {
            await elasticSearchClient.indices.create({ index: indexName });
            await elasticSearchClient.indices.refresh({ index: indexName });
            log.info(`Created index ${indexName}`);
        }
    } catch (error) {
        log.error(`An error occured while creating the index ${indexName}`);
        log.error('error', 'AuthService createIndex() method:', error);
    }
}

async function getIndexedData(index, itemId) {
    try {
        const result = await elasticSearchClient.get({ index, id: itemId });
        return result._source;
    } catch (error) {
        log.log('error', 'gigService elasticsearch getIndexedData() method:', error);

        return {};
    }
}
async function getDocumentCount(index) {
    try {
        const result = await elasticSearchClient.count({ index});
        return result.count;
    } catch (error) {
        log.log('error', 'gigService elasticsearch getDocumentCount() method:', error);

        return 0;
    }
}
async function addDataToIndex(index, itemId, gigDocument) {
    try {
        await elasticSearchClient.index({
            index,
            id: itemId,
            document: gigDocument
        })

    } catch (error) {
        log.log('error', 'gigService elasticsearch addDataToIndex() method:', error);
    }
}
async function updateIndexedData(index, itemId, gigDocument) {
    try {
        await elasticSearchClient.update({
            index,
            id: itemId,
            doc: gigDocument
        })

    } catch (error) {
        log.log('error', 'gigService elasticsearch updateIndexedData() method:', error);
    }
}
async function deleteIndexedData(index, itemId) {
    try {
        await elasticSearchClient.delete({
            index,
            id: itemId
        })

    } catch (error) {
        log.log('error', 'gigService elasticsearch deleteIndexedData() method:', error);
    }
}


export {
    elasticSearchClient,
    checkConnection,
    createIndex,
    getIndexedData,
    addDataToIndex,
    updateIndexedData,
    deleteIndexedData,
    getDocumentCount
};
