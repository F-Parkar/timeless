import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

const getReport = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  const now = new Date();
  let startDate;

  switch (period) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '90d':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }

  const salesData = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const bestSellers = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.qty' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $project: {
        name: '$productDetails.name',
        totalSold: 1,
      },
    },
  ]);

  res.json({ salesData, bestSellers });
});

export { getReport };
