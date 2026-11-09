import mongoose from "mongoose";
import DashboardModel from "../model/dashboard.model.js"; // adjust path if needed

const oid = (id) => new mongoose.Types.ObjectId(id);
const notCancelled = { $ne: ["$status", "CANCELLED"] };

const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = oid(req.user.id);
    const match = { sellerId };

    const [summary] = await DashboardModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: { $cond: [notCancelled, "$quantity", 0] } },
          totalRevenue: { $sum: { $cond: [notCancelled, "$totalPrice", 0] } },
          buyers: { $addToSet: "$userId" },
          products: { $addToSet: "$productId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalItemsSold: 1,
          totalRevenue: 1,
          totalBuyers: { $size: "$buyers" },
          totalProductsSold: { $size: "$products" },
          avgOrderValue: {
            $cond: [
              { $gt: ["$totalOrders", 0] },
              { $round: [{ $divide: ["$totalRevenue", "$totalOrders"] }, 2] },
              0,
            ],
          },
        },
      },
    ]);

    const statusRows = await DashboardModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = { PENDING: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
    statusRows.forEach((s) => (ordersByStatus[s._id] = s.count));

    // ---------- 3) per product: units sold, revenue, orders, buyers ----------
    const productRows = await DashboardModel.aggregate([
      { $match: { ...match, status: { $ne: "CANCELLED" } } },
      {
        $group: {
          _id: "$productId",
          unitsSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
          buyers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          unitsSold: 1,
          revenue: 1,
          orders: 1,
          buyersCount: { $size: "$buyers" },
        },
      },
      { $sort: { unitsSold: -1 } },
    ]);

    // ---------- 4) reviews per product (only if Review model exists) ----------
    const productIds = productRows.map((p) => p._id);
    let reviewMap = {};
    const Review = mongoose.models.Review;
    if (Review && productIds.length) {
      const reviewRows = await Review.aggregate([
        { $match: { productId: { $in: productIds } } },
        {
          $group: {
            _id: "$productId",
            reviewCount: { $sum: 1 },
            avgRating: { $avg: "$rating" },
          },
        },
      ]);
      reviewRows.forEach((r) => {
        reviewMap[String(r._id)] = {
          reviewCount: r.reviewCount,
          avgRating: Math.round((r.avgRating || 0) * 10) / 10,
        };
      });
    }

    // attach product name/price
    const populated = await DashboardModel.populate(productRows, {
      path: "_id",
      model: "Product",
      select: "name price",
    });

    const products = populated.map((p) => ({
      product: p._id, // { _id, name, price }
      unitsSold: p.unitsSold,
      revenue: p.revenue,
      orders: p.orders,
      buyers: p.buyersCount,
      reviewCount: reviewMap[String(p._id?._id)]?.reviewCount || 0,
      avgRating: reviewMap[String(p._id?._id)]?.avgRating || 0,
    }));

    const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);

    // ---------- 5) top buyers ----------
    const buyerRows = await DashboardModel.aggregate([
      { $match: { ...match, status: { $ne: "CANCELLED" } } },
      {
        $group: {
          _id: "$userId",
          orders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);
    const topBuyers = await DashboardModel.populate(buyerRows, {
      path: "_id",
      model: "User",
      select: "name email",
    });

    // ---------- 6) monthly revenue (last 12 months) ----------
    const since = new Date();
    since.setMonth(since.getMonth() - 11, 1);
    since.setHours(0, 0, 0, 0);
    const monthly = await DashboardModel.aggregate([
      { $match: { ...match, createdAt: { $gte: since }, status: { $ne: "CANCELLED" } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ---------- 7) recent orders ----------
    const recentOrders = await DashboardModel.find(match)
      .populate("userId", "name email")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      summary: {
        totalOrders: summary?.totalOrders || 0,
        totalRevenue: summary?.totalRevenue || 0,
        totalItemsSold: summary?.totalItemsSold || 0,
        totalBuyers: summary?.totalBuyers || 0,
        totalProductsSold: summary?.totalProductsSold || 0,
        avgOrderValue: summary?.avgOrderValue || 0,
        totalReviews,
      },
      ordersByStatus,
      products,
      topBuyers: topBuyers.map((b) => ({
        user: b._id,
        orders: b.orders,
        totalSpent: b.totalSpent,
      })),
      monthly,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default getSellerDashboard;