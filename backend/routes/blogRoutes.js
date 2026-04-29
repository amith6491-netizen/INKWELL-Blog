const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getMyBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllBlogs);
router.get('/my-blogs', protect, getMyBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
