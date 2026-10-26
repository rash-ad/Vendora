import {Router} from "express";
import {registerSeller,getAllSellers} from "../controller/seller.controller.js";

const router = Router();

router.route('/register').post(registerSeller);
router.route('/AllSellers').get(getAllSellers);
router.route('/Seller/:id').get(getAllSellers);

export default router;