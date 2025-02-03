import { databaseConnection } from "./database.js"
import { start } from "./server.js";
import express from 'express';
import './apm.js'
const app = express();

const init = async()=>{
    await databaseConnection();
    return await start(app);
}





const {orderChannel,socketIoOrderObject} = await init();



export{orderChannel,socketIoOrderObject};