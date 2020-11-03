import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
dotenv.config();

//  Mongo DB connect handles
connectDB();

//  API requests body parsers
app.use(express.json());

//  API routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

//  API not found and errors handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is runnning in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold));
