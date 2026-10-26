import sellerModel from "../model/seller.model.js";

const registerSeller = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const seller = new sellerModel({ name, email, password });
        await seller.save();
        res.status(201).json({ message: "Seller registered successfully", seller });
    }   

    catch(error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSellers = async (req, res) => {
    try {
        const sellers = await sellerModel.find();
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { registerSeller, getAllSellers };