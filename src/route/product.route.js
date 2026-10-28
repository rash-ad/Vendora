import {Router} from "express";
import {createProduct,getAllProducts,updateProduct,deleteProduct} from "../controller/Product.controller.js";

const router = Router();

router.route("/AllProducts").get(getAllProducts);
router.route("/createProduct").get(createProduct);
router.route("/updateProduct").put(updateProduct);
router.route("/deleteProduct").delete(deleteProduct);

export  default router;
