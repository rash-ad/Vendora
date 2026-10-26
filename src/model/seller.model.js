import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    shopDescription: {
        type: String,
        default: ""
    },
    businessAddress: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected","suspended"],
        default: "pending"

    
    }, 
    isActive: {
        type: Boolean,
        default: true
    }},
    {
         timestamps: true
    });
   


export default mongoose.model("Seller", sellerSchema);