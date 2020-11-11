import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
dotenv.config();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//  Mongo DB connect handles
connectDB();

//  API requests body parsers
app.use(express.json());

//  API routes
app.get('/', (req, res) => res.send('API is running...'));
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

//  API not found and errors handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is runnning in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold));
