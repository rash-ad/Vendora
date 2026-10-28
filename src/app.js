import express from "express";
import userRoutes from './route/User.route.js';
import sellerRoutes from './route/seller.route.js';
import productRoute from './route/product.route.js';
const  app= express();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/product',productRoute);

export  default app;