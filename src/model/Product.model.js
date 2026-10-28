import mongoose from "mongoose";

const ProductSchema= new mongoose.Schema(
    {
    ProductName:{
        type:String,
        required:true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export  default mongoose.model("Product", ProductSchema);