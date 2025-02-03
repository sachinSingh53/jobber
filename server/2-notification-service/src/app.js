import express from 'express';
import {start} from './server.js';
import './apm.js';

async function init() {
    const app = express();
    await start(app);
}

init();
