import express from 'express';
import 'dotenv/config';
import fs from 'fs';
import https from 'https';
import http from 'http';
import configureRoutes from './routes';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
const port = parseInt(process.env.PORT ?? '3000', 10);

//Parses json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('tiny'));

configureRoutes(app);

const isSSLEnabled = process.env.SSL_ENABLED === 'true';

const getOptions = () => {
  try {
    const key = fs.readFileSync('./certs/ssl.key');
    const cert = fs.readFileSync('./certs/ssl.pem');
    return {
      key,
      cert,
    };
  } catch (err) {
    console.error('Could not read key or cert.');
    throw err;
  }
};

let server;

if (isSSLEnabled) {
  const options = getOptions();
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

app.listen(port, () => {
  console.log(`API listening on port ${port}.  SSL Enabled: ${isSSLEnabled}`);
});
