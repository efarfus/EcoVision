import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import HttpError from './models/http-error';
import usersRoutes from './routes/user-routes'
import favoriteRoutes from './routes/favorites-routes'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

dotenv.config();

export const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json({ limit: '5mb' })); 



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use('/', usersRoutes);
app.use('/', favoriteRoutes);