import UserModel from '../model/User.model.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new UserModel({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export  default  registerUser ;