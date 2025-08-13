const Product = require('../models/Product');
const ChatUser = require('../models/ChatUser');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalChatUsers,
      recentProducts,
      topCountries,
      categoryStats,
      monthlyStats
    ] = await Promise.all([
      Product.countDocuments(),
      ChatUser.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5).select('name price images createdAt'),
      ChatUser.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      ChatUser.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ])
    ]);

    // Calculate revenue (if you add sales tracking later)
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalProducts,
      totalChatUsers,
      totalValue: totalValue[0]?.total || 0,
      recentProducts,
      topCountries: topCountries.map(c => ({ country: c._id, count: c.count })),
      categoryStats: categoryStats.map(c => ({ category: c._id, count: c.count })),
      monthlyStats: monthlyStats.map(m => ({
        period: `${m._id.year}-${m._id.month.toString().padStart(2, '0')}`,
        count: m.count
      }))
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin dashboard overview
// @route   GET /api/admin/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const [newProducts, newChatUsers] = await Promise.all([
      Product.countDocuments(dateFilter),
      ChatUser.countDocuments(dateFilter)
    ]);

    res.json({
      period,
      newProducts,
      newChatUsers,
      dateFilter
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardOverview
}; 