const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, data: users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status (ban/unban)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot ban an admin' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? 'User activated' : 'User banned',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Promote user to admin
// @route   PUT /api/admin/users/:id/promote
// @access  Admin
const promoteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User promoted to admin', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blogs (admin view)
// @route   GET /api/admin/blogs
// @access  Admin
const getAllBlogsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [blogs, total] = await Promise.all([
      Blog.find()
        .populate('author', 'username email')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Blog.countDocuments(),
    ]);

    res.json({ success: true, data: blogs, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any blog (admin)
// @route   DELETE /api/admin/blogs/:id
// @access  Admin
const deleteBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }
    await Comment.deleteMany({ blog: req.params.id });
    res.json({ success: true, message: 'Blog deleted by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBlogs, totalComments, recentBlogs] =
      await Promise.all([
        User.countDocuments(),
        Blog.countDocuments(),
        Comment.countDocuments(),
        Blog.find()
          .populate('author', 'username')
          .sort('-createdAt')
          .limit(5),
      ]);

    // Category breakdown
    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        totalComments,
        categoryStats,
        recentBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  promoteUser,
  getAllBlogsAdmin,
  deleteBlogAdmin,
  getDashboardStats,
};
