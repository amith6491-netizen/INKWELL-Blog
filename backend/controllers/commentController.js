const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
      parentComment: null,
    })
      .populate('author', 'username avatar')
      .sort('-createdAt');

    res.json({ success: true, data: comments, count: comments.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to a blog
// @route   POST /api/comments/:blogId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const blogExists = await Blog.findById(req.params.blogId);
    if (!blogExists) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: req.params.blogId,
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: comment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (author only)
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json({ success: true, message: 'Comment updated', data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (author or admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    // Also delete replies
    await Comment.deleteMany({ parentComment: req.params.id });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like / unlike a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    const userId = req.user._id.toString();
    const liked = comment.likes.map((l) => l.toString()).includes(userId);

    const update = liked
      ? { $pull: { likes: req.user._id } }
      : { $addToSet: { likes: req.user._id } };

    const updated = await Comment.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ success: true, liked: !liked, likeCount: updated.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
