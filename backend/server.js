import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import productRoutes from './routes/productRoutes.js'
import connectDB from './config/db.js'

const app = express();
dotenv.config();
connectDB();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);



const PORT = process.env.PORT;

app.listen(PORT, console.log(`server is runnning in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold));