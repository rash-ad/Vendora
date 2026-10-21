import express from "express";
import userRoutes from './route/User.route.js';
const  app= express();
app.use(express.json());

app.use('/api/user', userRoutes);

export  default app;