import winston from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport } from 'winston-elasticsearch';

// Define a function for log transformation
const esTransformer = (logdata) => {
    return ElasticsearchTransformer(logdata);
};

// Define a function to create a Winston logger

// elasticsearchNode
export const winstonLogger = (elasticsearchNode, name, level) => {
    const options = {
        console: {
            level,
            handleExceptions: true,
            json: false,
            colorize: true
        },
        elasticsearch: {
            level,
            transformer: esTransformer,
            clientOpts: {
                node: elasticsearchNode,
                log: level,
                maxRetries: 2,
                requestTimeout: 10000,
                sniffOnStart: false
            }
        }
    };

    // Create an Elasticsearch transport
    const esTransport = new ElasticsearchTransport(options.elasticsearch);

    // Create a Winston logger instance
    const logger = winston.createLogger({
        exitOnError: false,
        defaultMeta: { service: name },
        transports: [
            new winston.transports.Console(options.console),
            esTransport
        ]
    });

    return logger;
};

// export { winstonLogger }; // Export the logger creation function
