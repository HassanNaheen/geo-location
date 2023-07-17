import express, { Application } from 'express';
import router from './routes';
import { errorHandeler } from './error-handler';

const app: Application = express();

app.use('/', router);
app.use(errorHandeler);

export default app;
