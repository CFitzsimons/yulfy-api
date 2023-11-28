import express from 'express';
import configureRoutes from './routes';
import bodyParser from 'body-parser';


const app = express();
const port = parseInt(process.env.PORT ?? '3000', 10);

//Parses json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

configureRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})