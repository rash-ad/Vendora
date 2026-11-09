import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  widgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Widget",
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  ShowOrder:{
  type: Boolean,
  default: true

},
 ShowProduct:{
  type: Boolean,
  default: true
},
 ShowReviews:{
  type: Boolean,
  default: true
 },
  status: {
    type: String,
    enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
},
  { timestamps: true }
);

const DashboardModel = mongoose.model('Dashboard', dashboardSchema);


export default DashboardModel;
