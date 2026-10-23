import {Router} from "express";
import{ registerUser , getAllUsers,getUserById,updateUser,deleteUser} from '../controller/User.controller.js';
const router = Router();

router.route('/register').post(registerUser);
router.route('/AllUsers').get(getAllUsers);
router.route('/User/:id').get(getUserById);
router.route('/User/:id').put(updateUser);
router.route('/User/:id').delete(deleteUser);
export default router;