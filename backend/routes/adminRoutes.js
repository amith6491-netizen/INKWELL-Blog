const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  promoteUser,
  getAllBlogsAdmin,
  deleteBlogAdmin,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/promote', promoteUser);
router.get('/blogs', getAllBlogsAdmin);
router.delete('/blogs/:id', deleteBlogAdmin);

module.exports = router;
