import {Router} from 'express';
import getSellerDashboard  from '../controller/Dashboard.controller.js';

const router = Router();
router.get("/dashboard", getSellerDashboard);
export default router;