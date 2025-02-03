import { databaseConnection } from "./database.js"
import { redisConnect } from "./redis/redis.connection.js";
import { start } from "./server.js";
import express from 'express';
import './apm.js';
const app = express();

const init = async()=>{
    await databaseConnection();
    const gigChannel = await start(app);
    // start(app);
    redisConnect();
    return gigChannel;

}



const gigChannel = await init();


export{gigChannel};