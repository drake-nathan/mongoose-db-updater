import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();
const port = parseInt(process.env.PORT) || 8080;

const app = express();

// express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.get('/', (req, res) => res.send('hello world'));

const server = http.createServer(app);

server.listen(port, () => console.info('Server listening on port:', port));

export default server;
