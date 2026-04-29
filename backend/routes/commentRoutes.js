const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:blogId', getComments);
router.post('/:blogId', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, toggleCommentLike);

module.exports = router;
